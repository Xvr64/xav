import test from 'node:test';
import assert from 'node:assert/strict';
import { CREATION_PROGRAMS, CREATION_STAGES, CREATION_DURATION, WHALES_ARRIVE_AT, creationProgramAt, creationStage, arrivalOffset, creation, advanceCreation, finishCreation, shouldPlayCreation } from './creationTimeline.ts';

test('all original worlds and every arrival phase occur once, with contiguous boundaries', () => {
  assert.deepEqual(CREATION_STAGES.slice(0,5).map(s=>s[0]), ['EYE','CREATION','BIG_BANG','GALAXY','BLACK_HOLE']);
  CREATION_STAGES.forEach(([name,start,end],i)=>{
    assert.equal(creationStage(start),name);
    assert.equal(creationStage(end-.00001),name);
    assert.equal(end,CREATION_STAGES[i+1]?.[1]??CREATION_DURATION);
  });
  assert.equal(creationStage(CREATION_DURATION),'COMPLETE');
  assert.equal(creationStage(1e8),'COMPLETE');
});
test('arrival converges to the actual ambient poses with zero offset velocity and acceleration', () => {
  for(let i=0;i<2;i++){
    const end=88+i*2,dt=.001;
    assert.ok(arrivalOffset(end,i).every(v=>v===0));
    assert.ok(arrivalOffset(91,i).every(v=>v===0));
    const a=arrivalOffset(end-dt,i),b=arrivalOffset(end-2*dt,i);
    for(let axis=0;axis<3;axis++){
      assert.ok(Math.abs(a[axis]/dt)<.000001);
      assert.ok(Math.abs((b[axis]-2*a[axis])/(dt*dt))<.001);
    }
  }
  assert.ok(arrivalOffset(81,1)[2]<arrivalOffset(81,0)[2], 'companion approaches from greater depth');
});
test('the renderer program follows the original worlds, then the arrival', () => {
  assert.deepEqual([0,11.99,12,24.99,25,32.99,33,42.99,43,53.99,54,70,90].map(creationProgramAt),[0,0,1,1,2,2,3,3,4,4,5,5,5]);
  assert.equal(CREATION_PROGRAMS,6);
});
test('a transition still compiling holds the clock, without losing its place', () => {
  globalThis.document={documentElement:{style:{setProperty(){}}}};
  Object.assign(creation,{active:true,ready:true,paused:false,held:true,time:24.9});
  advanceCreation(.05);assert.equal(creation.time,24.9);
  creation.held=false;advanceCreation(.05);assert.ok(creation.time>24.9);
  Object.assign(creation,{active:false});delete globalThis.document;
});
test('each whale arrives along its own heading: the head leads, never the tail', () => {
  for(const forward of [[-1,0,0],[1,0,0],[.9,.1,-.42],[-.8,-.2,.56]]) for(let whale=0;whale<2;whale++){
    const a=arrivalOffset(82,whale,forward),b=arrivalOffset(85,whale,forward);
    const travel=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];
    assert.ok(travel[0]*forward[0]+travel[1]*forward[1]+travel[2]*forward[2]>0);
  }
});
test('the whales hold off until the water has passed the camera', () => {
  assert.ok(WHALES_ARRIVE_AT>=CREATION_STAGES.find(s=>s[0]==='OCEAN_ENTRY')[1]+3);
  for(let whale=0;whale<2;whale++){
    const start=arrivalOffset(WHALES_ARRIVE_AT,whale,[1,0,0]),end=arrivalOffset(WHALES_ARRIVE_AT+.001,whale,[1,0,0]);
    assert.ok(Math.abs(start[0]-end[0])<.001,'starts from rest, no jump');
  }
});
test('clock waits for resources, caps stalls, pauses, completes once, and never loops', () => {
  globalThis.document={documentElement:{style:{setProperty(){}}}};
  globalThis.sessionStorage={setItem(){}};
  Object.assign(creation,{active:true,ready:false,paused:false,time:0});
  advanceCreation(10);assert.equal(creation.time,0);
  creation.ready=true;advanceCreation(10);assert.equal(creation.time,.05);
  creation.paused=true;advanceCreation(1);assert.equal(creation.time,.05);
  creation.paused=false;let ends=0;const listener=()=>{if(!creation.active)ends++;};creation.listeners.add(listener);
  creation.time=CREATION_DURATION-.01;advanceCreation(.02);
  assert.equal(creation.active,false);assert.equal(ends,1);
  advanceCreation(10);finishCreation();assert.equal(ends,1);
  creation.listeners.delete(listener);delete globalThis.document;delete globalThis.sessionStorage;
});
test('server/non-browser imports have a static fallback',()=>assert.equal(shouldPlayCreation(),false));
