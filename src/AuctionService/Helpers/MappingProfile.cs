using AuctionService.Dtos;
using AuctionService.Entities;
using AutoMapper;
using Contracts;

namespace AuctionService.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Auction, AuctionReadDto>()
            .IncludeMembers(x => x.Item);

            CreateMap<Item, AuctionReadDto>();

            CreateMap<AuctionCreateDto, Auction>()
            .ForMember(d => d.Item, o => o.MapFrom(s => s));

            CreateMap<AuctionCreateDto, Item>();

            CreateMap<AuctionReadDto, AuctionCreated>();

            CreateMap<Auction, AuctionUpdated>().IncludeMembers(x => x.Item);
            CreateMap<Item, AuctionUpdated>();
        }
    }
}