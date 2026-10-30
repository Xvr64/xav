import test from 'node:test';
import assert from 'node:assert/strict';
import { ambientPath, sampleAmbientWhale, rollAt, socialAt } from './ambientWhaleScene.ts';
import { qRotate, vLen, vSub } from './whale3dPose.ts';

const composition = (width = 1280, height = 720) => ({ width, height, scroll: 2, weight: 0, lanes: [{x:0.78,y:0.8},{x:0.18,y:0.88}], surfaceY: -Infinity });
const angle = (a,b) => 2*Math.acos(Math.min(1,Math.abs(a.reduce((s,v,i)=>s+v*b[i],0))));

for (const [width,height] of [[1280,720],[390,844]]) {
  test(`ambient ${width}: both animals turn through every yaw quadrant, dive and stay continuous`, () => {
    const c = composition(width,height);
    for (let i=0;i<2;i++) {
      const bins = new Set(); let minPitch=1,maxPitch=-1; let previous;
      // 1600 s spans every phase of the social (263 s) and roll (317 s) cycles against both paths
      for (let t=0;t<1600;t+=0.05) {
        const pose=sampleAmbientWhale(i,t,c);
        assert.ok([...pose.position,...pose.quaternion].every(Number.isFinite));
        assert.ok(Math.abs(vLen(pose.quaternion.slice(0,3))**2+pose.quaternion[3]**2-1)<1e-6);
        const f=qRotate(pose.quaternion,[0,0,-1]);
        bins.add(Math.floor((Math.atan2(f[0],f[2])+Math.PI)/ (Math.PI/4))%8);
        minPitch=Math.min(minPitch,f[1]);maxPitch=Math.max(maxPitch,f[1]);
        // Under 115 deg/s, about 4 deg per frame at 30 fps: a pivot, never a flip
        if(previous) assert.ok(angle(previous.quaternion,pose.quaternion)<0.1,`heading jump ${i} at ${t}`);
        previous=pose;
      }
      assert.equal(bins.size,8); assert.ok(minPitch < -0.08 && maxPitch > 0.08);
    }
  });
  test(`ambient ${width}: social approaches retain body clearance`, () => {
    const c=composition(width,height);
    for(let t=0;t<530;t+=0.3) {
      const a=sampleAmbientWhale(0,t,c),b=sampleAmbientWhale(1,t,c);
      assert.ok(vLen(vSub(a.position,b.position))>(a.scale+b.scale)*0.43,`overlap at ${t}`);
    }
  });
}
test('ambient heading follows the 3D trajectory, with independent rhythms and restrained glides',()=>{
  const c=composition();
  for(let i=0;i<2;i++) {
    let minimum=2,maximum=0;
    for(let t=0;t<200;t+=0.25) {
      const w=sampleAmbientWhale(i,t,c);
      const tangent=vSub(ambientPath(i,t+0.01,c),ambientPath(i,t-0.01,c));
      const heading=qRotate(w.quaternion,[0,0,-1]);
      const dot=tangent.reduce((s,v,j)=>s+v*heading[j],0)/vLen(tangent);
      // Never swims backwards; while cruising the heading is the tangent within a few degrees
      assert.ok(dot>0,`backwards ${i} at ${t}`);
      if (vLen(tangent)/0.02/w.scale>0.08) assert.ok(dot>0.99,`heading off the path ${i} at ${t}`);
      minimum=Math.min(minimum,w.articulation.amplitude);maximum=Math.max(maximum,w.articulation.amplitude);
    }
    assert.ok(minimum<0.22 && maximum>0.65);
  }
  assert.notEqual(sampleAmbientWhale(0,10,c).articulation.stroke,sampleAmbientWhale(1,10,c).articulation.stroke);
});
test('ambient sampling is repeatable, rolls are occasional, social motion is bounded',()=>{
  const c=composition();
  const a=sampleAmbientWhale(1,150,c);
  sampleAmbientWhale(0,300,c);
  assert.deepEqual(a,sampleAmbientWhale(1,150,c));
  assert.equal(rollAt(0,200),0);assert.ok(Math.abs(rollAt(0,250)-Math.PI*2)<1e-8);
  assert.equal(socialAt(20),0);assert.equal(socialAt(145),1);assert.equal(socialAt(200),0);
});
