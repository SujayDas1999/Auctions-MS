using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{

    private readonly AppDbContext _context;

    public BidPlacedConsumer(AppDbContext context)
    {
        _context = context;
    }

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("---> Consuming Bid Placed");
        var message = context.Message;
        var auction = await _context.Auctions.FindAsync(context.Message.AuctionId);

        if (auction.CurrentHighBid == null
        || message.BidStatus.Contains("Accepted") && message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = message.Amount;

            await _context.SaveChangesAsync();
        }
    }
}
