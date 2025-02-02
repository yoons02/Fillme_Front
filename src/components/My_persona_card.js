import React, { memo } from "react";
import styles from "../static/css/style.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function My_persona_card({ Id, Name, Category, Image, Openpublic }) {
    console.log("부모 컴포넌트 props 추출", Id, Name, Category, Openpublic);
    const navigate = useNavigate();
    const imageUrl = "http://13.124.66.197" + Image;
    // console.log(imageUrl);

    // 버튼 상태 조절
    const [controlBtn, setControlBtn] = useState({
        hideState: true,
        hideBtnName: "공개",
    });

    // 공개 & 비공개 버튼
    const onHide = (e) => {
        e.preventDefault();
        if (controlBtn.hideState) {
            axios
                .patch(`http://13.124.66.197/mypage/persona/${Id}/openpublic/`)
                .then((res) => {
                    console.log(res, "페르소나 비공개 성공");
                    setControlBtn({
                        // 리렌더링++
                        hideState: false,
                        hideBtnName: "비공개",
                    });
                    window.location.replace("/Profile");
                })
                .catch((error) => {
                    console.log(error, "페르소나 비공개 실패");
                });
        } else {
            axios
                .patch(`http://13.124.66.197/mypage/persona/${Id}/openpublic/`)
                .then((res) => {
                    console.log(res, "페르소나 공개 성공");
                    setControlBtn({
                        // 리렌더링++
                        hideState: true,
                        hideBtnName: "공개",
                    });
                    window.location.replace("/Profile");
                })
                .catch((error) => {
                    console.log(error, "페르소나 공개 실패");
                });
        }
    };

    // 페르소나 삭제 버튼
    const onDelete = (e) => {
        e.preventDefault();
        if (window.confirm("해당 페르소나를 삭제하시겠습니까?")) {
            return axios
                .delete(`http://13.124.66.197/mypage/persona/${Id}/`)
                .then((res) => {
                    console.log(res, "페르소나 삭제 성공");
                    window.location.replace("/Profile");
                })
                .catch((res) => {
                    console.log(res, "페르소나 삭제 실패");
                });
        } else {
            return;
        }
    };
    return (
        <>
            <div
                className={styles.one_persona_card}
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <Link to="/UpdatePersona" state={{ personaId: `${Id}` }}>
                    <button className={styles.persona_card_update}>수정</button>
                </Link>
                <button className={styles.persona_card_delete} onClick={onDelete}>
                    삭제
                </button>
                <section className={styles.shadow}></section>
                <button
                    className={styles.show_persona_feed}
                    onClick={() => {
                        navigate(`user_profile/${Id}`, {
                            replace: true,
                        });
                    }}
                >
                    프로필 보기
                </button>
                <section className={styles.persona_card_name}>{Name}</section>
                <section className={styles.persona_card_category}>{Category}</section>

                <button className={styles.hideBtn} onClick={onHide}>
                    {controlBtn.hideBtnName}
                </button>
            </div>
        </>
    );
}

export default My_persona_card;
