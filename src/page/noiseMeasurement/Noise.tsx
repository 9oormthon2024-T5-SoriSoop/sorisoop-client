import React, { useEffect, useState } from "react";

interface NoiseDetailProps {
  noise: {
    id: number;
    x: number;
    y: number;
    avgDecibel: number;
    maxDecibel: number;
    createdAt: string;
    review: string;
    locationName?: string;
  };
  onBack: () => void;
}

const NoiseDetail: React.FC<NoiseDetailProps> = ({ noise, onBack }) => {
  const [address, setAddress] = useState<string>("");
  const styles = {
    container: {
      padding: "16px",
    },
    backButton: {
      marginBottom: "16px",
      padding: "10px",
      backgroundColor: "#f0f0f0",
      border: "1px solid #ccc",
      borderRadius: "8px",
      cursor: "pointer",
    },
    header: {
      fontSize: "18px",
      fontWeight: "bold" as const,
      marginBottom: "8px",
    },
    infoBox: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
      backgroundColor: "#f9f9f9",
    },
    reviewBox: {
      padding: "16px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    },
    map: {
      width: "100%",
      height: "300px",
      marginBottom: "16px",
      border: "1px solid #ccc",
      borderRadius: "8px",
    },
  };

  const REST_API_KEY = "83ce629a6d7b809e79dc0b269d5a78c9"; // REST API Key

  useEffect(() => {
    const fetchAddress = async () => {
      const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${noise.x}&y=${noise.y}`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.documents && data.documents.length > 0) {
          setAddress(data.documents[0].address_name);
        } else {
          setAddress("알 수 없는 위치");
        }
      } catch (error) {
        console.error("주소 변환 API 호출 중 오류 발생:", error);
        setAddress("주소를 가져올 수 없습니다.");
      }
    };

    fetchAddress();
  }, [noise.x, noise.y]);

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>
        뒤로가기
      </button>
      <div id="map" style={styles.map}>
        <p>{address || "지도 로딩 중..."}</p>
      </div>
      <div style={styles.infoBox}>
        <h1 style={styles.header}>{noise.locationName || address}</h1>
        <p>생성일: {noise.createdAt}</p>
        <p>평균 데시벨: {noise.avgDecibel} dB</p>
        <p>최대 데시벨: {noise.maxDecibel} dB</p>
      </div>
      <div style={styles.reviewBox}>
        <h3>한줄평</h3>
        <p>{noise.review}</p>
      </div>
    </div>
  );
};

export default NoiseDetail;