'use client';

import {
  Bodies,
  Body,
  Composite,
  Engine,
  Render,
  Runner,
  World,
} from 'matter-js';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

type LoadedTex = { url: string; width: number };

export type HeartRainHandle = {
  dropOne: () => void;
  dropInitial: (count: number) => void;
  removeOne: () => void;
};

type Props = {
  textures: string[];
  height: number;
  bottomOffset: number;
  sizeRange?: [number, number];
  tightness?: number;
  scaleFactor?: number;
  gravity?: number;
};

interface FadingBody {
  body: Body;
  start: number;
  originalX: number;
  originalY: number;
}

export default forwardRef<HeartRainHandle, Props>(function HeartRain(
  {
    textures,
    height,
    bottomOffset,
    sizeRange = [18, 34],
    tightness = 0.85,
    scaleFactor = 2.25,
    gravity = 1.1,
  },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const engineRef = useRef<Engine | null>(null);
  const texRef = useRef<LoadedTex[] | null>(null);
  const widthRef = useRef(0);
  const floorRef = useRef<Body | null>(null);

  const fadingBodiesRef = useRef<FadingBody[]>([]);

  // 외부에서 drop 호출 가능
  useImperativeHandle(ref, () => ({
    dropOne: () => {
      if (engineRef.current && texRef.current) spawnOne();
    },
    dropInitial: (count: number) => {
      let i = 0;
      const timer = setInterval(() => {
        if (i >= count) {
          clearInterval(timer);
          return;
        }
        if (engineRef.current && texRef.current) spawnOne();
        i++;
      }, 70);
    },
    removeOne: () => {
      const engine = engineRef.current;
      if (!engine) return;
      const bodies = Composite.allBodies(engine.world).filter(
        (b) => !b.isStatic,
      );
      const target = bodies.at(-1) ?? bodies[0];
      if (target) {
        fadingBodiesRef.current.push({
          body: target,
          start: performance.now(),
          originalX: target.position.x,
          originalY: target.position.y,
        });
      }
    },
  }));

  useEffect(() => {
    if (!wrapRef.current || !canvasRef.current) return;

    let cancelled = false;
    let rafId = 0;
    let render: Render | null = null;
    let runner: Runner | null = null;

    // 텍스처 로딩
    const loaders = textures.map(
      (url) =>
        new Promise<LoadedTex>((res, rej) => {
          const img = new Image();
          img.onload = () => res({ url, width: img.naturalWidth || 256 });
          img.onerror = rej;
          img.src = url;
        }),
    );

    Promise.all(loaders).then((loaded) => {
      if (cancelled) return;
      texRef.current = loaded;

      const el = wrapRef.current!;
      const width = (widthRef.current = el.clientWidth);
      const h = height;

      const engine = (engineRef.current = Engine.create());
      engine.world.gravity.y = gravity;

      render = Render.create({
        engine,
        canvas: canvasRef.current!,
        options: {
          width,
          height: h,
          wireframes: false,
          background: 'transparent',
        },
      });

      // 바닥/벽
      const FLOOR_THICK = 120;
      const floor = Bodies.rectangle(
        width / 2,
        h + FLOOR_THICK / 2,
        width * 2,
        FLOOR_THICK,
        {
          isStatic: true,
          render: { fillStyle: 'transparent' },
        },
      );
      floorRef.current = floor;

      const WALL_THICK = 80;
      const left = Bodies.rectangle(-WALL_THICK / 2, h / 2, WALL_THICK, h, {
        isStatic: true,
      });
      const right = Bodies.rectangle(
        width + WALL_THICK / 2,
        h / 2,
        WALL_THICK,
        h,
        { isStatic: true },
      );

      World.add(engine.world, [floor, left, right]);

      Render.run(render);
      runner = Runner.create();
      Runner.run(runner, engine);

      // 🔽 페이드/스케일 아웃 루프
      const loop = () => {
        const now = performance.now();
        const fadeTime = 500; // 0.5초
        for (let i = fadingBodiesRef.current.length - 1; i >= 0; i--) {
          const fb = fadingBodiesRef.current[i];
          const progress = Math.min((now - fb.start) / fadeTime, 1);
          const scale = 1 - progress;

          const sprite = fb.body.render.sprite;
          if (sprite && sprite.xScale && sprite.yScale) {
            // 비율을 누적 곱하기 대신, 프레임당 덮어쓰고 싶다면 원본 스케일을 보관해야 합니다.
            sprite.xScale *= scale;
            sprite.yScale *= scale;
          }

          if (progress >= 1) {
            World.remove(engine.world, fb.body);
            fadingBodiesRef.current.splice(i, 1);
          }
        }
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    });
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);

      if (runner && engineRef.current) {
        Runner.stop(runner);
      }
      if (render) {
        Render.stop(render);
        const c = render.canvas as HTMLCanvasElement | undefined;
        if (c) {
          const ctx = c.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, c.width, c.height);
        }
      }
      if (engineRef.current) {
        World.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
        engineRef.current = null;
      }

      floorRef.current = null;
      fadingBodiesRef.current = [];
      texRef.current = null;
    };
  }, [textures, height, gravity]);

  // bottomOffset이 변하면 floor만 옮김
  useEffect(() => {
    const floor = floorRef.current;
    if (!floor) return;
    const h = height;
    const FLOOR_THICK = 120;
    const floorTop = h - bottomOffset + 10;
    Body.setPosition(floor, {
      x: widthRef.current / 2,
      y: floorTop + FLOOR_THICK / 2,
    });
  }, [bottomOffset, height]);

  // 하트 생성 함수
  const spawnOne = () => {
    const engine = engineRef.current!;
    const loaded = texRef.current!;
    const width = widthRef.current;

    const tex = loaded[Math.floor(Math.random() * loaded.length)];
    const [minR, maxR] = sizeRange;
    const visR = rand(minR, maxR);
    const physR = visR * tightness;
    const x = rand(visR + 24, width - visR - 24);
    const y = -visR - 40;

    const body = Bodies.circle(x, y, physR, {
      restitution: 0.12,
      frictionAir: 0.002,
    });
    const scale = (visR * scaleFactor) / tex.width;
    body.render.sprite = {
      texture: tex.url,
      xScale: scale,
      yScale: scale,
      xOffset: 0.5,
      yOffset: 0.5,
    };

    World.add(engine.world, body);
  };

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none w-full"
      style={{ height }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
});

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
