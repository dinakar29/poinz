const
  assert = require('assert'),
  Immutable = require('immutable'),
  uuid = require('node-uuid').v4,
  commandTestUtils = require('./commandTestUtils'),
  processorFactory = require('../../src/commandProcessor'),
  handlerGatherer = require('../../src//handlerGatherer');

/**
 * Can serve as a sample for command testing.
 *
 * Can test whether a given command produces expected events (validation + preconditions + event production)
 * Can test whether the produced events modify the room as expected (event handler functions)
 */
describe('addStory', () => {

  beforeEach(function () {
    // we want to test with real command- and event handlers!
    const cmdHandlers = handlerGatherer.gatherCommandHandlers();
    const evtHandlers = handlerGatherer.gatherEventHandlers();

    this.userId = uuid();
    this.commandId = uuid();
    this.roomId = 'rm_' + uuid();

    // roomsStore is mocked so we can start with a clean slate and also manipulate state before tests
    this.mockRoomsStore = commandTestUtils.newMockRoomsStore(Immutable.fromJS({
      id: this.roomId,
      users: {
        [this.userId]: {
          id: this.userId,
          username: 'Tester'
        }
      },
      stories: {
        'abc': {
          id: 'abc',
          title: 'some',
          estimations: {}
        }
      }
    }));

    this.processor = processorFactory(cmdHandlers, evtHandlers, this.mockRoomsStore);
  });

  it('Should produce storyAdded event', function () {

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 1);

    const storyAddedEvent = producedEvents[0];
    commandTestUtils.assertValidEvent(storyAddedEvent, this.commandId, this.roomId, this.userId, 'storyAdded');
    assert.equal(storyAddedEvent.payload.title, 'SuperStory 232');
    assert.equal(storyAddedEvent.payload.description, 'This will be awesome');
    assert.deepEqual(storyAddedEvent.payload.estimations, {});

  });

  it('Should produce storyAdded and additional storySelected event if this is the first story', function () {
    this.mockRoomsStore.manipulate(room => room.removeIn(['stories', 'abc']));

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    }, this.userId);

    assert(producedEvents);
    assert.equal(producedEvents.length, 2);

    const storyAddedEvent = producedEvents[0];
    commandTestUtils.assertValidEvent(storyAddedEvent, this.commandId, this.roomId, this.userId, 'storyAdded');
    assert.equal(storyAddedEvent.payload.title, 'SuperStory 232');
    assert.equal(storyAddedEvent.payload.description, 'This will be awesome');
    assert.deepEqual(storyAddedEvent.payload.estimations, {});

    const storySelectedEvent = producedEvents[1];
    commandTestUtils.assertValidEvent(storySelectedEvent, this.commandId, this.roomId, this.userId, 'storySelected');


  });

  it('Should store new story in room', function () {

    const producedEvents = this.processor({
      id: this.commandId,
      roomId: this.roomId,
      name: 'addStory',
      payload: {
        title: 'SuperStory 232',
        description: 'This will be awesome'
      }
    }, this.userId);

    assert(this.mockRoomsStore.getRoomById().getIn(['stories', producedEvents[0].payload.id]), 'room must now contain added story');
  });

  describe('preconditions', () => {

    it('Should throw if user is a visitor', function () {
      this.mockRoomsStore.manipulate(room => room.setIn(['users', this.userId, 'visitor'], true));

      assert.throws(() => this.processor({
        id: this.commandId,
        roomId: this.roomId,
        name: 'addStory',
        payload: {
          title: 'SuperStory 232',
          description: 'This will be awesome'
        }
      }, this.userId), /Visitors cannot add stories!/);

    });

  });

});