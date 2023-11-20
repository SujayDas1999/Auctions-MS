using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.Services;

namespace SearchService.Data
{
    public static class DbInitializer
    {
        public static async Task InitDb(WebApplication app)
        {
            await DB.InitAsync("SearchDb", MongoClientSettings
    .FromConnectionString("mongodb://root:mongopw@localhost:27017/?authSource=admin&readPreference=primary&ssl=false&directConnection=true"));

            await DB.Index<Item>()
            .Key(x => x.Make, KeyType.Text)
            .Key(x => x.Model, KeyType.Text)
            .Key(x => x.Color, KeyType.Text)
            .CreateAsync();

            var count = await DB.CountAsync<Item>();

            using var scope = app.Services.CreateScope();

            var httpClient = scope.ServiceProvider.GetRequiredService<AuctionServiceHttpClient>();
            var items = await httpClient.GetItemsForSearchDb();

            Console.WriteLine(items.Count);

            if (items.Count > 0)
            {
                await DB.SaveAsync(items);
            }
        }
    }
}