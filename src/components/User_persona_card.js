import React, { memo } from "react";
import styles from "../static/css/style.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function User_persona_card({ Id, Name, Category, Image }) {
    const navigate = useNavigate();
    const imageUrl = "http://13.124.66.197" + Image;
    // console.log(imageUrl);

    return (
        <>
            <div
                className={styles.one_persona_card}
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <section className={styles.shadow}></section>
                <div>
                    <button
                        className={styles.show_persona_feed}
                        onClick={() => {
                            navigate(`/user_profile/${Id}`, {
                                replace: true,
                            });
                        }}
                    >
                        프로필 보기
                    </button>
                    <section className={styles.persona_card_name}>{Name}</section>
                    <section className={styles.persona_card_category}>{Category}</section>
                </div>
            </div>
        </>
    );
}

export default User_persona_card;
