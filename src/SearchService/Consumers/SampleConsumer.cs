using Contracts;
using MassTransit;

namespace SearchService;

public class SampleConsumer : IConsumer<SampleContract>
{
    public Task Consume(ConsumeContext<SampleContract> context)
    {
        throw new NotImplementedException();
    }
}
