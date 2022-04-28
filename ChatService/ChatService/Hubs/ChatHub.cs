using ChatService.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatService.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;
        private static List<Message> _messages = new List<Message>();
        public ChatHub(IDictionary<string, UserConnection> connections, IHubContext<ChatHub> hubContext)
        {
            _botUser = "MyChat Bot";
            _connections = connections;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                Clients.Group(userConnection.Room)
                    .SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has left {userConnection.Room}");
                SendConnectedUsers(userConnection.Room);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {     
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
            {
                Message newMessage = new Message();
                newMessage._Id = _messages.Count;
                newMessage._Content = message;
                newMessage.isRead = false;
                _messages.Add(newMessage);

                await Clients.Group(userConnection.Room)
                   .SendAsync("ReceiveMessage", userConnection.User, newMessage);
            }
        }

        public async Task JoinRoom(UserConnection userConnection)
        {

            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);
            _connections[Context.ConnectionId] = userConnection;

            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", _botUser, $"{userConnection.User} has joined {userConnection.Room}");

            await SendConnectedUsers(userConnection.Room);
        }

        public async Task<Task> SendConnectedUsers(string room)
        {
            var users = _connections.Values
                .Where(x => x.Room == room)
                .Select(x => x.User);
            return Clients.Group(room).SendAsync("UsersInRoom", users);
        }

        public async Task<Task> MarkMessageAsRead(int id)
        {
            var messageToRead = _messages.Find(x => x._Id == id && !x.isRead);
            messageToRead.isRead = true;

            return Clients.All.SendAsync("MessageRead", messageToRead);
        }
    }
}
