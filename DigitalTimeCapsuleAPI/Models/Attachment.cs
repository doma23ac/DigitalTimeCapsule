public class Attachment
{
    public int AttachmentID { get; set; }
    public string FilePath { get; set; }
    public string FileType { get; set; }
    public int CapsuleID { get; set; }

    public Capsule Capsule { get; set; }
}
