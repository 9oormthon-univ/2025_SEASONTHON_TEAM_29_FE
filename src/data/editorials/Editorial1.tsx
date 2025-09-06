// src/data/editorials/Editorial1.tsx
import Image from "next/image";

export default function Editorial1() {
  return (
    <section className="space-y-6">
      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        웨딩드레스는 단 한 번 입는 옷이지만, 그만큼 나의 장점을 극대화하고 단점을 보완할 수 있어야 해요.
        그 출발점은 ‘체형에 맞는 디자인을 아는 것' 입니다. 이번 매거진에서는 한국인 여성에게 흔한 6가지 체형을
        기준으로 어울리는 웨딩드레스 디자인을 소개합니다. 웨딩드레스 투어를 앞두고 있는 당신에게 도움이 됐으면 합니다.
      </p>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        하체 발달 체형: 슬림하게 정리하고 시선을 위로
      </h2>

      <figure className="mt-3 space-y-2">
        <Image
          src="/editorials/write1/1-img1.png"
          alt="하체 발달 체형에 어울리는 드레스 예시 1"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write1/1-img2.png"
          alt="하체 발달 체형에 어울리는 드레스 예시 2"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          추천 제품: 플레이브 아틀리에, ‘루디’
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        허벅지나 엉덩이가 발달한 체형은 하체를 부드럽게 감싸면서도 과도한 부피감을 피하는 것이 중요합니다.
        스커트 폭이 큰 드레스는 오히려 하체에 시선을 집중시킬 수 있으므로, 적당한 폭의 A라인이나 하체 라인을
        자연스럽게 덮는 엠파이어 라인이 잘 어울립니다. 의외로 무릎 아래에서 퍼지는 머메이드 실루엣은 하체의
        볼륨감을 장점으로 살려주면서 비율을 길게 만들어, 세련되고 당당한 인상을 줄 수 있습니다.
      </p>

      <div className="mt-3 space-y-1">
        <p className="text-text--default text-base font-medium font-['Inter'] leading-loose">
          추천 디자인:
          <span className="ml-1 text-text-secondary text-sm font-medium font-['Inter'] leading-normal">
            머메이드, 작은 A라인, 엠파이어 라인
          </span>
        </p>
        <p className="text-text--default text-base font-medium font-['Inter'] leading-loose">
          피해야 할 디자인:
          <span className="ml-1 text-text-secondary text-sm font-medium font-['Inter'] leading-normal">
            벨라인, 과도한 폭의 A라인
          </span>
        </p>
      </div>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        허리가 굵은 체형: 시선 트릭으로 잘록하게
      </h2>

      <figure className="mt-3 space-y-2">
        <Image
          src="/editorials/write1/1-img3.png"
          alt="허리가 굵은 체형에 어울리는 드레스 예시 1"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write1/1-img4.png"
          alt="허리가 굵은 체형에 어울리는 드레스 예시 2"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          추천 제품: 플레이브 아틀리에, ‘릴리안’
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        허리 굴곡이 뚜렷하지 않은 직사각형 체형은 허리선을 시각적으로 만들어주는 실루엣을 선택하는 게 중요합니다.
        허리 아래로 볼륨이 생기는 디자인이 자연스러운 곡선을 만들어주기 때문이죠. 특히 벨라인이나 프린세스 라인은
        허리선을 강조하면서도 하체로 볼륨을 분산시켜 비율을 이상적으로 만들어줍니다. 복부 라인이 고민일 경우,
        부드러운 러플이나 웨이스트 디테일이 있는 디자인도 추천해요.
      </p>

      <div className="mt-3 space-y-1">
        <p className="text-text--default text-base font-medium font-['Inter'] leading-loose">
          추천 넥라인:
          <span className="ml-1 text-text-secondary text-sm font-medium font-['Inter'] leading-normal">
            브이넥, 스퀘어넥, 슬리브리스
          </span>
        </p>
        <p className="text-text--default text-base font-medium font-['Inter'] leading-loose">
          피해야 할 디자인:
          <span className="ml-1 text-text-secondary text-sm font-medium font-['Inter'] leading-normal">
            엠파이어 라인, H라인
          </span>
        </p>
      </div>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        상체 발달형: 어깨를 가볍게, 시선은 아래로
      </h2>

      <figure className="mt-3 space-y-2">
        <Image
          src="/editorials/write1/1-img5.png"
          alt="상체 발달형에 어울리는 드레스 예시 1"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write1/1-img6.png"
          alt="상체 발달형에 어울리는 드레스 예시 2"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          추천 제품: 플레이브 아틀리에, ‘엘린’
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        어깨가 넓거나 팔뚝이 고민인 경우에는 어깨선을 가리기보다 과감히 드러내는 연출이 오히려 상체를 가볍고
        여리여리하게 보이게 합니다. 쇄골과 어깨의 곡선을 드러내 시선을 분산시키는 전략이 효과적이에요. 넥라인
        주변은 최대한 심플하게 두고, 시선이 자연스럽게 허리선이나 스커트 하단으로 내려가도록 장식과 포인트를
        배치하면 상체 비율이 한층 부드러워집니다. 헤어는 업스타일로 목선을 길게 드러내거나, 옆으로 흐르는
        웨이브로 어깨선을 가려주는 것도 좋아요.
      </p>

      <div className="mt-3 space-y-1">
        <p className="text-text--default text-base font-medium font-['Inter'] leading-loose">
          추천 디자인:
          <span className="ml-1 text-text-secondary text-sm font-medium font-['Inter'] leading-normal">
            A라인, 벨라인, 프린세스 라인
          </span>
        </p>
        <p className="text-text--default text-base font-medium font-['Inter'] leading-loose">
          피해야 할 디자인:
          <span className="ml-1 text-text-secondary text-sm font-medium font-['Inter'] leading-normal">
            브이넥, 스퀘어넥, 슬리브리스
          </span>
        </p>
      </div>

      <h2 className="text-text--default text-lg font-medium font-['Inter'] leading-loose">
        키가 작은 체형: 키가 커 보이는 드레스로
      </h2>

      <figure className="mt-3 space-y-2">
        <Image
          src="/editorials/write1/1-img7.png"
          alt="키가 작은 체형에 어울리는 드레스 예시 1"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <Image
          src="/editorials/write1/1-img8.png"
          alt="키가 작은 체형에 어울리는 드레스 예시 2"
          width={1200}
          height={800}
          className="w-full rounded-md"
        />
        <figcaption className="text-text-secondary text-xs font-normal font-['Inter'] leading-3 text-center">
          추천 제품: 플레이브 아틀리에, ‘케일리’
        </figcaption>
      </figure>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        아담한 체형은 허리선을 높여 다리를 길어 보이게 하는 디자인이 가장 효과적입니다. 상·하체의 경계를 위로 올리고,
        스커트가 바닥까지 부드럽게 퍼지며 내려오는 디자인을 선택하면 예식장에서도 또렷한 존재감을 만들 수 있어요.
        머메이드 실루엣이라면 무릎 아래부터 충분히 펼쳐져 전체 비율이 길어 보이도록 하는 것이 포인트입니다.
        지나치게 몸에 딱 붙는 드레스는 무대 위에서 존재감을 약하게 만들 수 있으니, 라인이 있으면서 하단에 볼륨
        포인트가 있는 스타일을 추천해요.
      </p>

      <div className="mt-3 space-y-1">
        <p className="text-text--default text-base font-medium font-['Inter'] leading-loose">
          추천 디자인:
          <span className="ml-1 text-text-secondary text-sm font-medium font-['Inter'] leading-normal">
            머메이드, 하이웨스트 A라인, 벨라인
          </span>
        </p>
        <p className="text-text--default text-base font-medium font-['Inter'] leading-loose">
          피해야 할 디자인:
          <span className="ml-1 text-text-secondary text-sm font-medium font-['Inter'] leading-normal">
            무릎~발목 중간 기장, H라인
          </span>
        </p>
      </div>

      <p className="text-text--default text-sm font-normal font-['Inter'] leading-normal">
        모든 체형은 각자의 개성과 장점을 가지고 있어요. 중요한 건 특정 체형을 감추는 것이 아니라,
        그 체형을 가장 아름답게 표현할 수 있는 실루엣을 고르는 것입니다. 드레스 투어를 앞두고 있다면,
        먼저 거울 앞에서 내 몸 구조를 천천히 살펴보는 것부터 시작해 보세요. 내가 가진 라인과 비율에 대해
        이해하게 된다면, 그 순간부터 드레스는 훨씬 더 당신과 가까운 옷이 될 수 있으니까요.
      </p>
    </section>
  );
}