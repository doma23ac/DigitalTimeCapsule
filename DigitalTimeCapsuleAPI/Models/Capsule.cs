using System;

public class Capsule
{
    public int CapsuleID { get; set; }
    public required string Title { get; set; }
    public required string Message { get; set; }
    public DateTime LockDate { get; set; }
    
    public int SenderID { get; set; }
    public int RecipientID { get; set; } // Make this nullable if it can be null in the database

    // Transient properties for username resolution
    public required string SenderUsername { get; set; }
    public required string RecipientUsername { get; set; }
}

