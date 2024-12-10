using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class UserRepository : BaseRepository
{
    private readonly DigitalTimeCapsuleContext _context;

    public UserRepository(DigitalTimeCapsuleContext context) : base(null)  // You can remove the IConfiguration if it's not needed
    {
        _context = context;
    }

    // Get all users
    public List<User> GetAllUsers()
    {
        return _context.Users.ToList();  // Get all users from the database
    }

    // Get a single user by ID
    public User GetUserById(int id)
    {
        return _context.Users.FirstOrDefault(u => u.UserID == id);
    }

    // Insert a new user
    public bool InsertUser(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();  // Save changes to the database
        return true;
    }

    // Update an existing user
    public bool UpdateUser(User user)
    {
        _context.Users.Update(user);
        _context.SaveChanges();  // Save changes to the database
        return true;
    }

    // Delete a user by ID
    public bool DeleteUser(int id)
    {
        var user = _context.Users.FirstOrDefault(u => u.UserID == id);
        if (user != null)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();  // Save changes to the database
            return true;
        }
        return false;
    }
}
