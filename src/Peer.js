import {NativeEventEmitter, NativeModules} from 'react-native';
import EventTarget from 'event-target-shim';


const {SkyWayPeerManager} = NativeModules;
const skyWayPeerEventEmitter = new NativeEventEmitter(SkyWayPeerManager);

const PeerStatus = {
  Disconnected: 0,
  Connected: 1,
};

const MediaConnectionStatus = {
  Disconnected: 0,
  Connected: 1,
};

export class PeerEvent {
  constructor(type, eventInitDict) {
    this.type = type.toString();
    Object.assign(this, eventInitDict);
  }
}

export class Peer extends EventTarget {

  constructor(peerId, options) {
    super();

    options = options || {};

    this.onPeerOpen = this.onPeerOpen.bind(this);
    this.onPeerCall = this.onPeerCall.bind(this);
    this.onPeerClose = this.onPeerClose.bind(this);
    this.onPeerDisconnected = this.onPeerDisconnected.bind(this);
    this.onPeerError = this.onPeerError.bind(this);
    this.onMediaConnection = this.onMediaConnection.bind(this);

    this._peerId = peerId;
    this._options = options;
    this._peerStatus = PeerStatus.Disconnected;
    this._mediaConnectionStatus = MediaConnectionStatus.Disconnected;
    this._disposed = false;

    this.init();
  }

  get peerId() {
    return this._peerId;
  }

  get options() {
    return this._options;
  }

  get peerStatus() {
    return this._peerStatus;
  }

  get mediaConnectionStatus() {
    return this._mediaConnectionStatus;
  }

  init() {
    SkyWayPeerManager.create(this._peerId, this._options, this._constraints);
    this.listen();
  }

  dispose() {
    SkyWayPeerManager.dispose(this._peerId);
    this.unlisten();

    this.disposed = true;
  }

  listen() {
    skyWayPeerEventEmitter.addListener('SkyWayPeerOpen', this.onPeerOpen);
    skyWayPeerEventEmitter.addListener('SkyWayPeerCall', this.onPeerCall);
    skyWayPeerEventEmitter.addListener('SkyWayPeerClose', this.onPeerClose);
    skyWayPeerEventEmitter.addListener('SkyWayPeerDisconnected', this.onPeerDisconnected);
    skyWayPeerEventEmitter.addListener('SkyWayPeerError', this.onPeerError);
    skyWayPeerEventEmitter.addListener('SkyWayMediaConnection', this.onMediaConnection);
  }

  unlisten() {
    skyWayPeerEventEmitter.removeListener('SkyWayPeerOpen', this.onPeerOpen);
    skyWayPeerEventEmitter.removeListener('SkyWayPeerCall', this.onPeerCall);
    skyWayPeerEventEmitter.removeListener('SkyWayPeerClose', this.onPeerClose);
    skyWayPeerEventEmitter.removeListener('SkyWayPeerDisconnected', this.onPeerDisconnected);
    skyWayPeerEventEmitter.removeListener('SkyWayPeerError', this.onPeerError);
    skyWayPeerEventEmitter.removeListener('SkyWayMediaConnection', this.onMediaConnection);
  }

  connect() {
    if (this.disposed) {
      return;
    }

    SkyWayPeerManager.connect(this.peerId);
  }

  disconnect() {
    if (this.disposed) {
      return;
    }

    SkyWayPeerManager.disconnect(this.peerId);
  }

  listAllPeers(callback) {
    if (this.disposed) {
      return;
    }
    SkyWayPeerManager.listAllPeers(this.peerId, callback);
  }

  call(targetPeerId) {
    if (this.disposed) {
      return;
    }

    SkyWayPeerManager.call(this.peerId, targetPeerId);
  }

  hangup() {
    if (this.disposed) {
      return;
    }

    SkyWayPeerManager.hangup(this.peerId);
  }

  onPeerOpen(payload) {
    if (payload.peer.id === this.peerId) {
      this.dispatchEvent(new PeerEvent('peer-open'));
    }
  }

  onPeerCall(payload) {
    if (payload.peer.id === this.peerId) {
      this.dispatchEvent(new PeerEvent('peer-call'));
    }
  }

  onPeerClose(payload) {
    if (payload.peer.id === this.peerId) {
      this.dispatchEvent(new PeerEvent('peer-close'));
    }
  }

  onPeerDisconnected(payload) {
    if (payload.peer.id === this.peerId) {
      this.dispatchEvent(new PeerEvent('peer-disconnected'));
    }
  }

  onPeerError(payload) {
    if (payload.peer.id === this.peerId) {
      this.dispatchEvent(new PeerEvent('peer-error'));
    }
  }

  onMediaConnection(payload) {
    if (payload.peer.id === this.peerId) {
      this.dispatchEvent(new PeerEvent('media-connection'));
    }
  }

  onPeerStatusChange(payload) {
    if (payload.peer.id === this.peerId) {
      this._peerStatus = this.payload.status;
      this.dispatchEvent(new PeerEvent('peer-status-change'));
    }
  }

  onMediaConnectionStatusChange(payload) {
    if (payload.peer.id === this.peerId) {
      this._mediaConnectionStatus = this.payload.status;
      this.dispatchEvent(new PeerEvent('media-connection-status-change'));
    }
  }

}

Peer.PeerStatus = PeerStatus;
Peer.MediaConnectionStatus = MediaConnectionStatus;