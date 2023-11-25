using System.Net;
using AuctionService.Data;
using AuctionService.Dtos;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
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
        private readonly IPublishEndpoint _publishEndpoint;

        public AuctionsController(AppDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint)
        {
            _context = context;
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
        }

        [HttpGet]
        public async Task<ActionResult<List<AuctionReadDto>>> GetAuctionItems([FromQuery] string date)
        {
            var query = _context.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

            if (!string.IsNullOrEmpty(date))
            {
                query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
            }

            return await query.ProjectTo<AuctionReadDto>(_mapper.ConfigurationProvider).ToListAsync();
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

        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateAuction([FromBody] AuctionCreateDto auctionCreateDto)
        {
            Auction auction = _mapper.Map<Auction>(auctionCreateDto);
            auction.Seller = User.Identity.Name;


            _context.Auctions.Add(auction);

            AuctionReadDto newAuction = _mapper.Map<AuctionReadDto>(auction);

            await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

            var isSuccess = await _context.SaveChangesAsync() > 0;
            if (!isSuccess)
            {
                return StatusCode(500, "Failed to create Auction");
            }



            return CreatedAtAction(nameof(GetAuctionItemById), new { auction.Id }, _mapper.Map<AuctionReadDto>(auction));
        }

        [Authorize]
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateAuction(Guid id, [FromBody] AuctionUpdateDto auctionUpdateDto)
        {
            var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (auction == null) return NotFound();

            //TODO: check seller with username
            if (auction.Seller != User.Identity.Name) return Forbid("---> Unable to update the details");

            auction.Item.Make = auctionUpdateDto.Make ?? auction.Item.Make;
            auction.Item.Model = auctionUpdateDto.Model ?? auction.Item.Model;
            auction.Item.Color = auctionUpdateDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = auctionUpdateDto.Mileage ?? auction.Item.Mileage;
            auction.Item.Year = auctionUpdateDto.Year ?? auction.Item.Year;

            await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest("--> Problem saving changes");

        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteAuction(Guid id)
        {
            var auction = await _context.Auctions.FindAsync(id);

            if (auction == null) return NotFound();

            //TODO: check seller with username
            if (auction.Seller != User.Identity.Name) return Forbid("---> Unable to update the details");

            _context.Auctions.Remove(auction);

            await _publishEndpoint.Publish<AuctionDeleted>(new { Id = auction.Id.ToString() });

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok($"{id} --> Deleted");

            return BadRequest("---> Bad Request");
        }
    }
}