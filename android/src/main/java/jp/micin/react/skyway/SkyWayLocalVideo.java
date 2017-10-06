package jp.micin.react.skyway;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import io.skyway.Peer.Browser.Canvas;

public class SkyWayLocalVideo extends ViewGroup implements SkyWayPeerObserver {

  private SkyWayPeer peer;
  private Canvas canvas;
  private boolean rendering;

  public SkyWayLocalVideo(Context context) {
    super(context);

    canvas = new Canvas(context);
    addView(canvas);

    rendering = false;
  }

  public void setPeer(SkyWayPeer peer) {
    SkyWayPeer oldPeer = this.peer;
    if (oldPeer != peer) {
      if (oldPeer != null ) {
        if (oldPeer.getLocalStream() != null) {
          oldPeer.getLocalStream().removeVideoRenderer(canvas, 0);
          rendering = false;
        }
        oldPeer.removeObserver(this);
      }

      this.peer = peer;
      this.peer.addObserver(this);

      addRendererIfCan();
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    if (peer != null ) {
      if (peer.getLocalStream() != null) {
        peer.getLocalStream().removeVideoRenderer(canvas, 0);
        rendering = false;
      }
      peer.removeObserver(this);
    }

    super.onDetachedFromWindow();
  }

  @Override
  protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    final int widthSize = MeasureSpec.getSize(widthMeasureSpec);
    final int heightSize = MeasureSpec.getSize(heightMeasureSpec);
    setMeasuredDimension(widthSize, heightSize);

    canvas.measure(widthMeasureSpec, heightMeasureSpec);
  }

  @Override
  protected void onLayout(boolean changed, int l, int t, int r, int b) {
    canvas.layout(0, 0, r-l, b-t);
  }

  @Override
  public void onLocalStreamOpen(SkyWayPeer peer) {
    addRendererIfCan();
    relayout();
  }

  @Override
  public void onLocalStreamWillClose(SkyWayPeer _peer) {
    if (peer != null && peer.getLocalStream() != null) {
      peer.getLocalStream().removeVideoRenderer(canvas, 0);
      rendering = false;
    }
  }

  private void addRendererIfCan() {
    if (!rendering && peer != null && peer.getLocalStream() != null) {
      peer.getLocalStream().addVideoRenderer(canvas, 0);
      rendering = true;
    }
  }

  private void relayout() {
    measure(
            View.MeasureSpec.makeMeasureSpec(getMeasuredWidth(), View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(getMeasuredHeight(), View.MeasureSpec.EXACTLY));
    layout(this.getLeft(), this.getTop(), this.getRight(), this.getBottom());
  }

  @Override
  public void onPeerOpen(SkyWayPeer peer) {}
  @Override
  public void onPeerCall(SkyWayPeer peer) {}
  @Override
  public void onPeerClose(SkyWayPeer peer) {}
  @Override
  public void onPeerDisconnected(SkyWayPeer peer) {}
  @Override
  public void onPeerError(SkyWayPeer peer) {}

  @Override
  public void onRemoteStreamOpen(SkyWayPeer peer) {}
  @Override
  public void onRemoteStreamWillClose(SkyWayPeer peer) {}

  @Override
  public void onMediaConnection(SkyWayPeer peer) {}
  @Override
  public void onPeerStatusChange(SkyWayPeer peer) {}
  @Override
  public void onMediaConnectionStatusChange(SkyWayPeer peer) {}

}
