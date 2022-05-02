namespace ChatService.Models
{
    public class Message
    {
        public int _Id { get; set; }
        public string _Type { get; set; }   
        public string _Sender { get; set; }
        public string _Content { get; set; }
        public int _Views { get; set; }
        public bool _isRead { get; set; }

    }
}
