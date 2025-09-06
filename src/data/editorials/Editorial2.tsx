// src/data/editorials/Editorial2.tsx
import Image from 'next/image';

export default function Editorial2() {
  return (
    <section className="space-y-6">
      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        카메라를 의식하지 않는 순간, 행복에 흠뻑 빠져있는 찰나의 표정을 포착하는
        일. 픽자스냅은 제주의 푸른 자연을 배경으로 신랑신부의 가장 자연스러운
        모습을 담아내는 작가입니다. 경쾌한 움직임과 터져나오는 웃음, 그리고 그
        순간을 완벽하게 잡는 감각. 여기에 소문난 플레이리스트와 유쾌한
        디렉팅까지, 촬영 자체가 최고의 추억이 되는 픽자스냅을 만나보세요.
      </p>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        1. 경쾌한 움직임이 느껴지는 포착의 미학
      </h2>

      <figure className="mt-3 space-y-2">
        <Image
          src="/editorials/write2/2-img1.png"
          alt="픽자스냅 촬영 예시 1"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write2/2-img2.png"
          alt="픽자스냅 촬영 예시 2"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          픽자스냅 제공
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        픽자스냅의 가장 큰 강점은 움직이는 &apos;찰나&apos;를 기가막히게
        포착해낸다는 것입니다. 카메라를 전혀 의식하지 못할 때, 촬영 상황에 흠뻑
        빠져있을 때 나도 모르게 튀어나오는 행복한 순간들을 놓치지 않죠. 경쾌한
        움직임과 웃음이 터지는 순간이 고스란히 담긴 픽자의 스냅은 볼 때마다 그
        순간으로 신랑신부를 데려다 놓는 마법 같은 힘을 지니고 있습니다.
      </p>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        2. 사진 찍는 맛 나는 플리와 유쾌한 디렉팅
      </h2>

      <figure className="mt-3 space-y-2">
        <Image
          src="/editorials/write2/2-img3.png"
          alt="픽자스냅 촬영 예시 3"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write2/2-img4.png"
          alt="픽자스냅 촬영 예시 4"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          픽자스냅 제공
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        픽자는 소문난 &apos;플레이리스트&apos; 맛집이기도 합니다. 바뀌는 장소의
        무드에 따라, 촬영 컨셉에 따라 찰떡같은 음악을 틀어주는 센스는 카메라
        뚝딱이도 어깨춤을 추게 만드는 필살기죠. 여기에 끝없이 텐션을 올려주는
        작가의 유머감각까지 더해져, 픽자와의 촬영은 자체로 최고의 추억이 됩니다.
      </p>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        3. 자연과의 조화를 최우선하는 섬세함
      </h2>

      <figure className="mt-3 space-y-2">
        <Image
          src="/editorials/write2/2-img5.png"
          alt="픽자스냅 촬영 예시 5"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write2/2-img6.png"
          alt="픽자스냅 촬영 예시 6"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          픽자스냅 제공
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        적당히 청량한 색감과 제주도 자연의 푸릇함을 고스란히 살리는 픽자만의
        보정 감성도 매력적입니다. 부부가 지닌 고유한 매력은 살리되 최소한의
        터치만 가미해, 10년 뒤에 보더라도 자연스러운 청춘의 모습이 그대로
        남아있죠. 과도한 보정 없이도 완성되는 자연스러운 아름다움이 픽자를
        선택하게 만드는 또 다른 이유입니다.
      </p>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        픽자는 제주의 특색 있는 자연을 중요시해, 들과 오름, 바다, 숲에서의
        촬영을 선호합니다. 셀렉 후 보정본 수령까지 최대 두 달 정도가 소요되는
        만큼, 충분한 여유를 갖고 예약하시는 것을 추천드립니다!
      </p>
    </section>
  );
}
