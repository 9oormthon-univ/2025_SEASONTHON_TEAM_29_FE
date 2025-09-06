// src/data/editorials/Editorial3.tsx
import Image from 'next/image';

export default function Editorial3() {
  return (
    <section className="space-y-6">
      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        사진 속 신부의 머릿결이 유독 아름답게 흐르는 순간, 그 뒤엔 디자이너
        박하의 손길이 있습니다. 출장 헤어변형 디자이너 박하는 얼굴형, 드레스,
        촬영 콘셉트를 빠르게 파악해, 단 한 컷의 장면에도 어울리는 헤어를
        완성하는 감각으로 주목받는 아티스트인데요. 잔머리 한 올까지 섬세하게
        디렉팅하며 신부를 진정한 ‘주인공’으로 만들어주는 디자이너 박하의 매력을
        정리해보았습니다.
      </p>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        1. 섬세한 디테일이 만드는 ‘나의 스타일&apos;
      </h2>

      <figure className="mt-3 space-y-2">
        <Image
          src="/editorials/write3/3-img1.png"
          alt="디자이너 박하 스타일링 예시 1"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write3/3-img2.png"
          alt="디자이너 박하 스타일링 예시 2"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          박하 제공
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        같은 웨이브도, 같은 번도 박하의 손을 거치면 전혀 다른 인상이 됩니다.
        신부의 얼굴형, 이목구비, 드레스의 넥라인까지 고려해 가르마의 방향,
        웨이브의 굵기, 번의 높이 등을 섬세하게 조정하죠. 단순히 유행하는
        스타일을 적용하는 것이 아니라, 신부의 결에 가장 잘 어울리는 것을
        찾습니다.
      </p>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        2. 시간 안에, 횟수 제한 없이
      </h2>

      <figure className="mt-3 space-y-2">
        <Image
          src="/editorials/write3/3-img3.png"
          alt="디자이너 박하 출장 변형 예시 1"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write3/3-img4.png"
          alt="디자이너 박하 출장 변형 예시 2"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          박하 제공
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        박하의 출장 스타일링은 예약 시간 내 헤어 변형 횟수에 제한이 없습니다.
        촬영 장소나 콘셉트가 바뀔 때마다 빠르게 머리를 고쳐주고, 작은 움직임에
        흩어진 머릿결도 놓치지 않고 정돈해주는 세심함이 돋보이죠. 단 한 번의
        예식, 단 하루의 촬영이기에 그야말로 신부의 모든 순간을 책임집니다.
      </p>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        3. 흐름과 결을 살린 자연스러움
      </h2>

      <figure className="mt-3 space-y-3">
        <Image
          src="/editorials/write3/3-img5.png"
          alt="디자이너 박하 자연스러운 스타일 1"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write3/3-img6.png"
          alt="디자이너 박하 자연스러운 스타일 2"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          박하 제공
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        과한 장식이나 세팅보다는, 머리카락 본연의 흐름과 결을 살리는 스타일링을
        추구합니다. 머리를 꽁꽁 틀어 올리는 대신, 가볍게 흘러내리는 애교머리와
        잔머리 디테일로 사랑스럽고 우아한 무드를 완성하죠. 작은 조각처럼
        흩어지는 잔머리 하나에도 촬영 무드에 따른 섬세한 조정이 들어가기 때문에,
        단정하면서도 감정이 살아있는 스타일이 만들어집니다.
      </p>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        디자이너 박하는 웨딩 촬영 외에도 본식 헤어·메이크업과 2부 변형 출장을
        받아볼 수 있는데요. 인기가 많아 스케줄이 빠르게 차는 만큼, 기간을 넉넉히
        잡고 예약하는 것이 좋습니다. 예약과 상담 문의 전에 원하는 스타일을 미리
        살펴보시는 것을 추천드려요!
      </p>
    </section>
  );
}
