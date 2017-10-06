
#import "RNSkyWayPeerManager.h"
#import "RNSkyWayPeer.h"

@implementation RNSkyWayPeerManager

@synthesize bridge = _bridge;

- (void)dealloc
{
    [_peers removeAllObjects];
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _peers = [NSMutableDictionary new];
    }
    return self;
}

- (RNSkyWayPeer *)peerById:(NSString *)peerId {
    return _peers[peerId];
}


RCT_EXPORT_METHOD(create:(nonnull NSString *)peerId
                  options:(NSDictionary *)options
                  constraints:(NSDictionary *)constraints)
{
    NSLog(@"RNSkyWayPeerManager create");
    
    RNSkyWayPeer *peer = [[RNSkyWayPeer alloc] initWithPeerId:peerId options:options constraints:constraints];
    self.peers[peerId] = peer;
    [peer addDelegate:self];
}

RCT_EXPORT_METHOD(connect:(nonnull NSString *)peerId)
{
    NSLog(@"RNSkyWayPeerManager connect");
    
    [self.peers[peerId] connect];
}

RCT_EXPORT_METHOD(disconnect:(nonnull NSString *)peerId)
{
    NSLog(@"RNSkyWayPeerManager disconnect");
    
    [self.peers[peerId] disconnect];
}


RCT_EXPORT_METHOD(dispose:(nonnull NSString *)peerId)
{
    NSLog(@"RNSkyWayPeerManager dispose");
    
    [self.peers[peerId] disconnect];
    [self.peers removeObjectForKey:peerId];
}


RCT_EXPORT_METHOD(listAllPeers:(nonnull NSString *)peerId
                  callback:(RCTResponseSenderBlock)callback)
{
    NSLog(@"RNSkyWayPeerManager listAll");
    
    [self.peers[peerId] listAllPeers:callback];
}

RCT_EXPORT_METHOD(call:(nonnull NSString *)peerId
                  targetPeerId:(nonnull NSString *)targetPeerId)
{
    NSLog(@"RNSkyWayPeerManager call");
    
    [self.peers[peerId] call:targetPeerId];
}

RCT_EXPORT_METHOD(hangup:(nonnull NSString *)peerId)
{
    NSLog(@"RNSkyWayPeerManager hangup");
    
    [self.peers[peerId] hangup];
}


RCT_EXPORT_MODULE(SkyWayPeerManager);

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
             @"SkyWayPeerOpen",
             @"SkyWayPeerCall",
             @"SkyWayPeerClose",
             @"SkyWayPeerDisconnected",
             @"SkyWayPeerError",
             @"SkyWayMediaConnection",
             @"SkyWayPeerStatusChange",
             @"SkyWayMediaConnectionStatusChange"
             ];
}

-(void)onOpen:(RNSkyWayPeer *)peer {
    [self sendEventWithName:@"SkyWayPeerOpen" body:@{@"peer": @{@"id": peer.peer.identity}}];
}
-(void)onCall:(RNSkyWayPeer *)peer {
    [self sendEventWithName:@"SkyWayPeerCall" body:@{@"peer": @{@"id": peer.peer.identity}}];
}
-(void)onClose:(RNSkyWayPeer *)peer {
    [self sendEventWithName:@"SkyWayPeerClose" body:@{@"peer": @{@"id": peer.peer.identity}}];
}
-(void)onDisconnected:(RNSkyWayPeer *)peer {
    [self sendEventWithName:@"SkyWayPeerDisconnected" body:@{@"peer": @{@"id": peer.peer.identity}}];
}
-(void)onError:(RNSkyWayPeer *)peer {
    [self sendEventWithName:@"SkyWayPeerError" body:@{@"peer": @{@"id": peer.peer.identity}}];
}
-(void)onMediaConnection:(RNSkyWayPeer *)peer {
    [self sendEventWithName:@"SkyWayMediaConnection" body:@{@"peer": @{@"id": peer.peer.identity}}];
}

-(void)onPeerStatusChange:(RNSkyWayPeer *)peer {
    NSNumber *status = [NSNumber numberWithInt: peer.peerStatus];
    [self sendEventWithName:@"SkyWayPeerStatusChange" body:@{@"peer": @{@"id": peer.peer.identity}, @"status": status}];
}
-(void)onMediaConnectionStatusChange:(RNSkyWayPeer *)peer {
    NSNumber *status = [NSNumber numberWithInt: peer.mediaConnectionStatus];
    [self sendEventWithName:@"SkyWayMediaConnectionStatusChange" body:@{@"peer": @{@"id": peer.peer.identity}, @"status": status}];
}



@end