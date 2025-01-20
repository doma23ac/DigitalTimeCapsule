using Microsoft.EntityFrameworkCore;

//not in Use anymore, can be ignored
public class DigitalTimeCapsuleContext : DbContext
{
    public DigitalTimeCapsuleContext(DbContextOptions<DigitalTimeCapsuleContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Capsule> Capsules { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<CapsuleTag> CapsuleTags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CapsuleTag>()
            .HasKey(ct => new { ct.CapsuleID, ct.TagID });
    }
}