using System;

public class Capsule
{
    public int CapsuleID { get; set; }
    public string Title { get; set; }
    public string Message { get; set; }
    public DateTime LockDate { get; set; }
    
    public int SenderID { get; set; }
    public int? RecipientID { get; set; }

    // Transient properties for username resolution
    public string SenderUsername { get; set; }
    public string RecipientUsername { get; set; }
}

