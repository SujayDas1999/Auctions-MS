using System.Net;
using AuctionService.Data;
using AuctionService.Dtos;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers
{
    [Route("api/auctions")]
    [ApiController]
    public class AuctionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public AuctionsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<AuctionReadDto>>> GetAuctionItems()
        {
            var auctionItems = await _context.Auctions
            .Include(p => p.Item)
            .OrderBy(x => x.Item.Make)
            .ToListAsync();

            List<AuctionReadDto> auctionReadDto = _mapper.Map<List<AuctionReadDto>>(auctionItems);

            return Ok(auctionReadDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuctionReadDto>> GetAuctionItemById(Guid id)
        {
            var auctionItem = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (auctionItem == null)
            {
                return NotFound("Auction Not Found");
            }

            AuctionReadDto auctionReadDto = _mapper.Map<AuctionReadDto>(auctionItem);

            return Ok(auctionReadDto);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAuction([FromBody] AuctionCreateDto auctionCreateDto)
        {
            Auction auction = _mapper.Map<Auction>(auctionCreateDto);
            auction.Seller = "test";


            _context.Auctions.Add(auction);

            var isSuccess = await _context.SaveChangesAsync() > 0;
            if (!isSuccess)
            {
                return StatusCode(500, "Failed to create Auction");
            }

            return CreatedAtAction(nameof(GetAuctionItemById), new { auction.Id }, _mapper.Map<AuctionReadDto>(auction));
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateAuction(Guid id, [FromBody] AuctionUpdateDto auctionUpdateDto)
        {
            var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (auction == null) return NotFound();

            //TODO: check seller with username

            auction.Item.Make = auctionUpdateDto.Make ?? auction.Item.Make;
            auction.Item.Model = auctionUpdateDto.Model ?? auction.Item.Model;
            auction.Item.Color = auctionUpdateDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = auctionUpdateDto.Mileage ?? auction.Item.Mileage;
            auction.Item.Year = auctionUpdateDto.Year ?? auction.Item.Year;

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest("--> Problem saving changes");

        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteAuction(Guid id)
        {
            var auction = await _context.Auctions.FindAsync(id);

            if (auction == null) return NotFound();

            //TODO: check seller with username

            _context.Auctions.Remove(auction);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok($"{id} --> Deleted");

            return BadRequest("---> Bad Request");
        }
    }
}