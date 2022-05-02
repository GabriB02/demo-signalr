    using ChatService.Models;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace ChatService.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly IDictionary<string, UserConnection> _connections;
        private static List<Message> _messages = new List<Message>();
        public ChatHub(IDictionary<string, UserConnection> connections)
        {
            _botUser = "MyChat Bot";
            _connections = connections;
        }

        public string Task getConnectionId(UserConnection userConnection)
        {
            _connections.TryGetValue(userConnection, out Context.ConnectionId);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection? userConnection))
            {
                _connections.Remove(Context.ConnectionId);

                Message disconnectMessage = new Message();
                disconnectMessage._Id = _messages.Count;
                disconnectMessage._Type = "info";
                disconnectMessage._Sender = _botUser;
                disconnectMessage._Content = $"{userConnection.User} has left {userConnection.Room}";
                disconnectMessage._isRead = false;
                _messages.Add(disconnectMessage);

                Clients.Group(userConnection.Room)
                    .SendAsync("ReceiveMessage", disconnectMessage);
                SendConnectedUsers(userConnection.Room);
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out UserConnection? userConnection))
            {
                Message newMessage = new()
                {
                    _Id = _messages.Count,
                    _Type = "normal",
                    _Sender = userConnection.User,
                    _Content = message,
                    _isRead = false
                };
                _messages.Add(newMessage);

                await Clients.Group(userConnection.Room)
                   .SendAsync("ReceiveMessage", newMessage);
            }
        }

        public async Task JoinRoom(UserConnection userConnection)
        {

            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);
            _connections[Context.ConnectionId] = userConnection;

            Message joinMessage = new()
            {
                _Id = _messages.Count,
                _Type = "info",
                _Sender = _botUser,
                _Content = $"{userConnection.User} has joined {userConnection.Room}",
                _isRead = false
            };
            _messages.Add(joinMessage);

            await Clients.Group(userConnection.Room).SendAsync("ReceiveMessage", joinMessage);

            await SendConnectedUsers(userConnection.Room);
        }

        public Task SendConnectedUsers(string room)
        {
            var users = _connections.Values
                .Where(x => x.Room == room)
                .Select(x => x.User);
            return Clients.Group(room).SendAsync("UsersInRoom", users);
        }

        public async Task MarkMessageAsRead(int id)
        {

            Message? messageToRead = _messages.Find(x => x._Id == id && !x._isRead);
            if (messageToRead is not null)
            {
                messageToRead._Views++;
                if (messageToRead._Views == _connections.Count)
                {
                    messageToRead._isRead = true;
                    await Clients.Client()

                }
                    

                await Clients.Caller.SendAsync("ReadMessage", id);
            }
            else
            {
                throw new ArgumentNullException("No message with the provided id");
            }
        }
    }
}
