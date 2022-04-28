namespace ChatService.Models
{
    public class Message
    {
        public int _Id { get; set; }
        public string _Content { get; set; }

        public bool isRead { get; set; }

    }
}
