public class Capsule
{
    public int CapsuleID { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public DateTime LockDate { get; set; }
    public string Status { get; set; }
    public int SenderID { get; set; }
    public int? RecipientID { get; set; }

    public User Sender { get; set; }
    public User Recipient { get; set; }
}
