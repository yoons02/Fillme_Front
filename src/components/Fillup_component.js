import styles from "../static/css/Fillup.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import SwiperCore, { Navigation, Pagination, Mousewheel, Scrollbar, Keyboard } from "swiper";
import "../static/css/fillup.css";
import { useNavigate } from "react-router";
function Fillup_component() {
    SwiperCore.use([Navigation, Pagination, Mousewheel, Scrollbar, Keyboard]);
    const local_persona_data = JSON.parse(localStorage.getItem("local_persona_data"));

    //페르소나 만들기 버튼 클릭 시
    const navigate = useNavigate();
    const make_persona = () => {
        navigate("/SignupPersona");
    };

    //사진 버튼 선택 여부
    const [button1, setbutton1] = useState(true);
    //영상 버튼 선택 여부
    const [button2, setbutton2] = useState(false);

    const [reload, setreload] = useState(random_qna[random_num]);

    //페르소나 여부 (하나도 없으면 false)
    const persona_state = local_persona_data.length == 0 ? false : true;

    const [form, setForm] = useState({
        persona: "",
        title: "",
        content: "",
    });
    //폼 저장된 내용 확인
    useEffect(() => {
        console.log(form);
    }, [form]);

    //페르소나 선택됐을 때, 값 갱신
    const handleSelect = (e) => {
        setForm((prevState) => {
            return {
                ...prevState,
                persona: e.target.value,
            };
        });
    };

    //사진 버튼 클릭했을 때
    const onclick1 = () => {
        setbutton1(true);
        setbutton2(false);
    };

    //영상버튼 클릭했을 때
    const onclick2 = () => {
        setbutton2(true);
        setbutton1(false);
    };

    // 새로고침 버튼 클릭했을 때, 질문 랜덤으로 뽑기
    const reload_btn = () => {
        setreload(random_qna[Math.floor(Math.random() * random_qna.length)]);
        // console.log(reload);
    };

    //이미지 목록
    const [imagelist, setImagelist] = useState([]);
    const [postImages, setPostImages] = useState([]);
    const addImage = (e) => {
        const selectedImageList = e.target.files;
        const currentPostImageList = [...postImages];
        const currentImageList = [...imagelist];

        console.log(postImages);

        for (let i = 0; i < selectedImageList.length; i += 1) {
            const currentImageURL = URL.createObjectURL(selectedImageList[i]);
            currentImageList.push(currentImageURL);
            currentPostImageList.push(selectedImageList[i]);
        }
        if (currentImageList.length > 10) {
            alert("최대 10장만 선택이 가능합니다. 다시 선택해 주세요");
            currentPostImageList = [...postImages];
            currentImageList = [...imagelist];
        }
        setImagelist(currentImageList);
        setPostImages(currentPostImageList);
    };

    const [video, setVideo] = useState([]);
    const [video_url, setVideoUrl] = useState();
    const selectVideo = (e) => {
        setVideo(e.target.files);
        setVideoUrl(URL.createObjectURL(e.target.files[0]));
    };

    // useEffect(() => {
    //     console.log(video_url);
    // }, [video_url]);

    const onChange_title = (e) => {
        const title = e.target.value;
        setForm({
            ...form,
            title: title,
        });
    };
    const onChange_context = (e) => {
        const content = e.target.value;

        setForm({
            ...form,
            content: content,
        });
    };
    const Submit_video = async (e) => {
        e.preventDefault();
        let formData = new FormData();

        formData.append("persona", form.persona);
        formData.append("content", form.content);
        formData.append("title", form.title);
        formData.append("video", video[0], video[0].name);
        await axios
            .post("http://13.124.66.197/post/video_post_create/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (res) {
                console.log(res, "post 성공");
                navigate("/Feed");
            })
            .catch(function (err) {
                console.log(err, "post 실패");
                console.log("폼데이터", formData);
                alert("페르소나 선택, 영상, 제목, 본문 내용은 필수 입력란입니다");
                for (let key of formData.keys()) {
                    console.log(key);
                }

                /* value 확인하기 */
                for (let value of formData.values()) {
                    console.log(value);
                }
            });
    };
    const Submit_image = async (e) => {
        e.preventDefault();
        let formData = new FormData();

        for (let i = 0; i < postImages.length; i += 1) {
            if (postImages) {
                formData.append(`image${i + 1}`, postImages[i], postImages[i].name);
            }
        }

        formData.append("persona", form.persona);
        formData.append("content", form.content);
        formData.append("title", form.title);

        await axios
            .post("http://13.124.66.197/post/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(function (res) {
                console.log(res, "post 성공");
                navigate("/Feed");
            })
            .catch(function (err) {
                console.log(err, "post 실패");
                console.log("폼데이터", formData);
                alert("페르소나 선택, 사진, 제목, 본문 내용은 필수 입력란입니다");
                for (let key of formData.keys()) {
                    console.log(key);
                }

                /* value 확인하기 */
                for (let value of formData.values()) {
                    console.log(value);
                }
            });
    };
    //선택된 이미지 확인
    useEffect(() => {
        // console.log(imagelist);
    }, [imagelist]);

    //이미지 삭제
    const handleDeleteImage = (id) => {
        console.log("삭제 id", id);
        setImagelist(imagelist.filter((_, index) => index !== id));
        setPostImages(postImages.filter((_, index) => index !== id));
    };

    return (
        <>
            {persona_state ? null : (
                <>
                    <p className={styles.form}>먼저 페르소나를 추가해주세요</p>
                    <button
                        className={styles.button_inactive}
                        style={{ marginBottom: "2.5vw" }}
                        onClick={make_persona}
                    >
                        페르소나 추가하러 가기
                    </button>
                </>
            )}
            <div id="fillup_page" className={persona_state ? null : styles.no_persona}>
                <p className={styles.form}>게시글을 작성할 페르소나를 선택해주세요 *</p>
                <select
                    className={styles.select}
                    disabled={persona_state ? false : true}
                    onChange={handleSelect}
                >
                    <option style={{ display: `none` }} value="selected">
                        페르소나 선택
                    </option>
                    {persona_state
                        ? local_persona_data.map((p) => (
                              <option value={p.id} key={p.id}>
                                  {p.name}
                              </option>
                          ))
                        : null}
                </select>
                <br />
                <br />
                <br />
                <p className={styles.form}>게시글의 유형을 선택해주세요 *</p>
                <button
                    onClick={onclick1}
                    disabled={persona_state ? false : true}
                    className={button1 ? styles.button_active : styles.button_inactive}
                >
                    사진
                </button>
                <button
                    onClick={onclick2}
                    disabled={persona_state ? false : true}
                    className={button2 ? styles.button_active : styles.button_inactive}
                >
                    영상
                </button>{" "}
                <br />
                <br />
                <br />
                {/* 사진, 영상 조건문 -> 사진 버튼 눌렸으면 사진 관련, 영상 버튼 눌렸으면 영상 관련 */}
                {button1 ? (
                    <>
                        <div style={{ display: `flex`, flexDirection: `row` }}>
                            <p className={styles.form}>사진을 선택해주세요 *</p>

                            {/* input 커스터마이징 */}
                            <label htmlFor="image">
                                <img src="images/plus_button.png" className={styles.plus_button} />
                            </label>
                            <input
                                onChange={addImage}
                                type="file"
                                accept="image/*"
                                id="image"
                                style={{ display: `none` }}
                                multiple
                                disabled={persona_state ? false : true}
                            ></input>

                            <p className={styles.text}> (최대 10장) </p>
                        </div>
                        {imagelist.length === 0 ? (
                            <label htmlFor="image">
                                <div className={styles.input_box2}>사진을 선택해주세요</div>
                            </label>
                        ) : (
                            <div className="image_list">
                                <Swiper
                                    className="swiper-container"
                                    spaceBetween={0}
                                    slidesPerView={6}
                                    onSlideChange={() => console.log("slide change")}
                                    // navigation
                                    // pagination={{ clickable: true }}
                                    // mousewheel={true}
                                    scrollbar={{ draggable: true }}
                                    direction="horizontal"
                                >
                                    {imagelist.map((image, id) => (
                                        <SwiperSlide key={id}>
                                            <img
                                                class="delete"
                                                src="images/delete.png"
                                                onClick={() => handleDeleteImage(id)}
                                            />
                                            <img
                                                src={image}
                                                alt={`${image}-${id}`}
                                                className={styles.image_list}
                                            />
                                        </SwiperSlide>
                                    ))}
                                    <div
                                        class="swiper-scrollbar"
                                        style={{ marginTop: "50px" }}
                                    ></div>
                                </Swiper>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div style={{ display: `flex`, flexDirection: `row` }}>
                            <p className={styles.form}>영상을 선택해주세요 *</p>

                            {/* input 커스터마이징 */}

                            <label htmlFor="video">
                                <img src="images/plus_button.png" className={styles.plus_button} />
                            </label>
                            <p className={styles.text}> (90초 이하의 영상 1개) </p>
                            <input
                                onChange={selectVideo}
                                type="file"
                                accept="video/*"
                                id="video"
                                style={{ display: `none` }}
                                disabled={persona_state ? false : true}
                            ></input>
                        </div>
                        {video.length === 0 ? (
                            <label htmlFor="video">
                                <div className={styles.input_box}>영상을 선택해주세요</div>
                            </label>
                        ) : (
                            <div className="image_list">
                                <video src={video_url} className={styles.image_list} />
                            </div>
                        )}
                    </>
                )}
                <br />
                <br />
                <div className={styles.random} id="random_question">
                    <section className={styles.random_text}>
                        어떤 글을 써야할지 모르겠다면 이런 주제는 어때요?
                        <button
                            onClick={reload_btn}
                            className={styles.reload_button}
                            disabled={persona_state ? false : true}
                        ></button>
                    </section>
                    <section className={styles.random_question}>{reload}</section>
                </div>
                <br /> <br />
                <p className={styles.form}>제목을 입력해주세요 *</p>
                <section>
                    <input
                        className={styles.select}
                        placeholder="제목을 입력해주세요 (띄어쓰기 포함 최대 20자)"
                        style={{ color: "black", backgroundImage: `none` }}
                        disabled={persona_state ? false : true}
                        value={form.title}
                        onChange={onChange_title}
                    ></input>
                </section>
                <br /> <br />
                <p className={styles.form}>본문을 입력해주세요 *</p>
                <textarea
                    className={styles.textarea}
                    disabled={persona_state ? false : true}
                    value={form.content}
                    onChange={onChange_context}
                ></textarea>
                <br />
                <br />
                <button
                    className={styles.submit_button}
                    disabled={persona_state ? false : true}
                    onClick={button1 ? Submit_image : Submit_video}
                >
                    업로드 하기
                </button>
            </div>
        </>
    );
}
export default Fillup_component;
const random_qna = [
    "무더운 여름이 지나가고 시원한 가을이 오려는 요즘! 지난 여름은 어땠나요? 많이 더워서 힘들었을 수도, 한편으론 여름을 즐겼을 수도 있었을 텐데요! 본인의 여름나기를 공유해 보세요!",
    "자랑하고 싶었지만 남에게 보여주진 못 했던 자신만의 끼가 있지 않나요?! 여기서는 숨기지 말고 보여 주세요! 숨겨진 자신의 능력을 자랑해 보세요!",
    "깊게 생각하지 마세요! 오늘 하루의 당신은 어땠나요? 어떤 감정을 느꼈는지, 어떤 경험을 했는지 자신의 하루를 정리해 보세요!",
    "이번엔 타인을 위한 게시물을 쓰는 건 어떤가요? 자신이 과거에 했던 혹은 하지 못 했던 일 중에 후회하거나 추천하는 일이 있다면 공유해 주세요! 당신의 조언이 어쩌면 누군가에겐 큰 힘이 될 수 있답니다 :)",
    "지금 당장 떠날 수 있다면 어디로 가고 싶으신가요?! 일상에서 벗어나 자신만의 자유로운 상상을 펼쳐 보세요!",
    "혹시 두려움에 도전해 보지 못 했던 일이 있나요? 그 일을 도전하는 자신의 모습을 상상하며 글을 작성해 보세요! 후에 실제로 실천해 본다면 더욱 좋겠죠!?",
];
const random_num = Math.floor(Math.random() * random_qna.length);
