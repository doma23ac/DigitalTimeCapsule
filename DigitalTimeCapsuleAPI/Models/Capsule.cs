using System;

public class Capsule
{
    public int CapsuleID { get; set; }
    public required string Title { get; set; }
    public required string Message { get; set; }
    public DateTime LockDate { get; set; }
    
    public int SenderID { get; set; }
    public int RecipientID { get; set; } 

    
    public required string SenderUsername { get; set; }
    public required string RecipientUsername { get; set; }
}

