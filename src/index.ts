import { Queue, QueueOptions, RedisOptions } from 'bullmq'
import IORedis from 'ioredis'
import { Reshuffle, BaseConnector, EventConfiguration } from 'reshuffle-base-connector'

export interface BullMQConnectorConfigOptions {
  queueName: string
  connectionProps?: RedisOptions
  queueOptions?: QueueOptions
}

export interface BullMQConnectorEventOptions {
  option1?: string
}

export default class BullMQConnector extends BaseConnector<
  BullMQConnectorConfigOptions,
  BullMQConnectorEventOptions
> {
  private readonly _queue: Queue

  constructor(app: Reshuffle, options: BullMQConnectorConfigOptions, id?: string) {
    const { queueName, queueOptions, connectionProps } = options
    const connection = new IORedis(connectionProps)
    super(app, options, id)
    this._queue = new Queue(queueName, { ...queueOptions, connection })
  }

  onStart(): void {
    // If you need to do something specific on start, otherwise remove this function
  }

  onStop(): void {
    // If you need to do something specific on stop, otherwise remove this function
  }

  // Your events
  on(options: BullMQConnectorEventOptions, handler: any, eventId: string): EventConfiguration {
    if (!eventId) {
      eventId = `BullMQ/${options.option1}/${this.id}`
    }
    const event = new EventConfiguration(eventId, this, options)
    this.eventConfigurations[event.id] = event

    this.app.when(event, handler)

    return event
  }

  // Your actions
  action1(bar: string): void {
    // Your implementation here
  }

  action2(foo: string): void {
    // Your implementation here
  }

  queue(): Queue {
    return this._queue
  }
}

export { BullMQConnector }
