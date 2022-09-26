import React, { useEffect, useRef, useState } from "react";
import '../components/middle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faSearch, faPaperPlane, faSadCry, faVideo, faImage } from '@fortawesome/free-solid-svg-icons'
import { db, auth } from "../services/firebase";
import { ref, onValue, push, set } from "firebase/database"
import {
    onAuthStateChanged
} from "firebase/auth";
import moment from "moment";






const Middle = () => {


    //Start Search Chat
    const [userName, setUserName] = useState('')
    const [user, setUser] = useState(null)
    const [err, setErr] = useState(false)
    const [userId, setUserId] = useState('')

    // left-chat
    const [chats, setChats] = useState([])
    const [chatUserName, setChatUserName] = useState("")


    //right side chatbox msg
    const [userMsg, setUserMsg] = useState('')

    // send msg
    const [text, setText] = useState('')
    const [img, setImg] = useState(null)
    const [video, setVideo] = useState(null)

    // const { currentUser } = useContext(AuthContext);
    const [agent, setAgent] = useState('');

    const messageEndRef = useRef(null);

    const authListener = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setAgent(user)
            } else {
                setAgent('')
            }
        })
    }
    useEffect(() => {
        authListener()
    })

    const handleSearch = () => {


        const starCountRef = ref(db, userName);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            const formattedTasks = [];

            if (data) {
                const tasks = Object.values(data);

                tasks.forEach(task =>
                    Object.entries(task).forEach(([key, value]) =>
                        formattedTasks.push({ name: key, data: value })
                    )
                );
                setUser(formattedTasks)
                setUserId(userName)
                setErr(false)
                console.log(user)
            } else {
                setErr(true)
            }


        });

        console.log(user)
    }




    const handleKey = e => {
        e.code === 'Enter' && handleSearch()
    }

    const handleSelect = (u) => {
        u && handleChat(u)
        setUser(null)
        setUserName("")
    }

    // end Search chat


    // start left chat fetch
    useEffect(() => {
        const starCountRef = ref(db);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setChats(data)

        });

    }, [])
    // end left chat fetch

    // start right chat
    const handleChat = (u) => {
        setChatUserName(u)

        const starCountRef = ref(db, u);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setUserMsg(data)
            //    console.log(userMsg)
        });

    }

    // end of right chat

    // start sending chat and image


    const handleSendEnter = e => {
        if (text.trim().length > 0) {
            e.code === "Enter" && handleSendText()
        }

    }

    const handleSendText = () => {
        if (text.trim().length > 0) {

            let userinfo = Object.entries(userMsg)
            let lastMsgFullDate = userinfo[userinfo.length - 1][1].Response.dateAndTime
            let lastMsgDate = lastMsgFullDate.split(" ")[0].split("-")[0]
            let newDate = new Date()
            let newMsgDate = newDate.getDate();

            console.log(new Date().getTime())

            let updateHasDate = false

            if (lastMsgDate < newMsgDate) {
                updateHasDate = true
            }


            const postListRef = ref(db, chatUserName);
            const newPostRef = push(postListRef);
            set(newPostRef, {
                Response: {
                    name: agent.uid,
                    message: text,
                    hasImage: false,
                    hasVideo: false,
                    hasDate: updateHasDate,
                    dateAndTime: `${moment().format("DD-MM-YYYY HH:mm:ss")}`,
                    dateAndTimeStamp: `${new Date().getTime()}`,
                    responseType: 1,
                    ticketData: {
                        IssuesList: "",
                        isTicketAgentResponse: false,
                        isTicketUserResponse: false,
                        ticketButtons: false,
                        ticketMessage: ""
                    }
                }
            });

            setText('')
        }
    }

    const handleSendImg = () => {
     console.log("hi")

    }

    const handleSendVideo = () => {

    }

    useEffect(() => {
        messageEndRef.current.scrollIntoView()
    }, [userMsg]);
    //end sending chat and image
    return (
        <div className="container">
            <div className="leftSide">
                {/* Header */}
                <div className="header">
                    <div className="userimg">
                        <img src={require('../image/img2.jpg')} alt="" className="cover" />
                    </div>
                    <ul className="nav_icons">
                        <li>
                            <FontAwesomeIcon icon={faSadCry} />
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </li>
                    </ul>
                </div>


                {/* <!-- Search Chat --> */}
                <div className="search_chat">
                    <div>
                        <input type="text" placeholder="Search or start new chat" onChange={e => setUserName(e.target.value)} onKeyDown={handleKey} value={userName} />
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </div>



                {/* <!-- CHAT SEARCH OTPUT --> */}
                <div className="chatlist">
                    {err && (<span>User not found!</span>)}
                    {user && (<div className="block active" onClick={() => handleSelect(userId)}>
                        <div className="imgBox">
                            {/* <img src={require('../image/img1.jpg')} alt="" className="cover" /> */}
                            {/* <span>{currentUser.uid}</span> */}
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>{userId}</h4>
                                <p className="time">{user[user.length - 1].data.dateAndTime}</p>
                            </div>
                            <div className="message_p">
                                <p>{user[user.length - 1].data.message}</p>
                            </div>
                        </div>
                    </div>)}

                    {/* <!-- CHAT LIST --> */}
                    <>
                        {Object.entries(chats).sort((a, b) => (Object.values(b[1]).pop().Response.dateAndTimeStamp) - (Object.values(a[1]).pop().Response.dateAndTimeStamp)).map((chat) => (<>

                            <div className="block" key={chat[0]} onClick={() => handleChat(chat[0])}>

                                <div className="imgBox" >
                                    <img src={require('../image/img5.jpg')} alt="" className="cover" />
                                </div>
                                <div className="details" key={chat}>
                                    <div className="listHead" key={chat[0]}>
                                        <h4>{chat[0]}</h4>
                                        <p className="time" key={chat[1]}>{Object.values(chat[1]).pop().Response.dateAndTime}</p>
                                    </div>


                                    {Object.values(chat[1]).pop().Response.hasVideo || Object.values(chat[1]).pop().Response.hasImage ?
                                        (Object.values(chat[1]).pop().Response.hasVideo ?
                                            (<div className="message_p">
                                                <p>Video</p>
                                            </div>)
                                            :
                                            (<div className="message_p">
                                                <p>Image</p>
                                            </div>))
                                        :
                                        (<div className="message_p">
                                            <p>{Object.values(chat[1]).pop().Response.message}</p>
                                        </div>)}



                                </div>
                            </div>
                        </>
                        ))}
                    </>

                    {/* 
                    <div className="block">
                        <div className="imgBox">
                            <img src={require('../image/img6.jpg')} alt="" className="cover" />
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Zoey</h4>
                                <p className="time">18/01/2022</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                            </div>
                        </div>
                    </div> */}



                    {/* <div className="block">
                        <div className="imgBox">
                            <img src={require('../image/img7.jpg')} alt="" className="cover" />
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Josh</h4>
                                <p className="time">17/01/2022</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                            </div>
                        </div>
                    </div> */}


                    {/* <div className="block">
                        <div className="imgBox">
                            <img src={require('../image/img8.jpg')} alt="" className="cover" />
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Dian</h4>
                                <p className="time">15/01/2022</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                            </div>
                        </div>
                    </div> */}


                    {/* <div className="block">
                        <div className="imgBox">
                            <img src={require('../image/img9.jpg')} alt="" className="cover" />
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Sam</h4>
                                <p className="time">Yesterday</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                            </div>
                        </div>
                    </div> */}


                    {/* <div className="block">
                        <div className="imgBox">
                            <img src={require('../image/img3.jpg')} alt="" className="cover" />
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Junior</h4>
                                <p className="time">18/01/2022</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                            </div>
                        </div>
                    </div> */}


                    {/* <div className="block">
                        <div className="imgBox">
                            <img src={require('../image/img6.jpg')} alt="" className="cover" />
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Zoey</h4>
                                <p className="time">18/01/2022</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                            </div>
                        </div>
                    </div> */}

                    {/*
                    <div className="block">
                        <div className="imgBox">
                          <img src={profileImg} className="cover" alt=""/> 
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Josh</h4>
                                <p className="time">17/01/2022</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                            </div>
                        </div>
                    </div>


                    <div className="block">
                        <div className="imgBox">
                            <img src={profileImg} className="cover" alt=""/>
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Dian</h4>
                                <p className="time">15/01/2022</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                            </div>
                        </div>
                    </div>
                */}

                </div>
            </div>
            <div className="rightSide">
                <div className="header">
                    <div className="imgText">
                        <div className="userimg">
                            <img src={require('../image/img6.jpg')} alt="" className="cover" />
                        </div>
                        <h4>{chatUserName}<br />
                            {/* <span>online</span> */}
                        </h4>
                    </div>
                    <ul className="nav_icons">
                        <li>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </li>
                    </ul>
                </div>

                {/* <!-- CHAT-BOX --> */}
                <div className="chatbox">

                    {Object.entries(userMsg).map((userMsg) => (
                        userMsg[1].Response.responseType === 1 ?
                            (<>
                                <div className="message my_msg">
                                    {userMsg[1].Response.hasImage ? (<><div className="message my_msg_img"><iframe src={userMsg[1].Response.message} alt="Agent" ><span>{userMsg[1].Response.dateAndTime.split(' ')[1]}</span></iframe></div></>) : (<><p>{userMsg[1].Response.message}<br /><span>{userMsg[1].Response.dateAndTime.split(' ')[1]}</span></p></>)}

                                </div>
                            </>)
                            :
                            (<>
                                <div className="message friend_msg">
                                    {userMsg[1].Response.hasImage ? (<><div className="message friend_msg_img"><iframe src={userMsg[1].Response.message} alt="user" ><span>{userMsg[1].Response.dateAndTime.split(' ')[1]}</span></iframe></div></>) : (<><p>{userMsg[1].Response.message}<br /><span>{userMsg[1].Response.dateAndTime.split(' ')[1]}</span></p></>)}

                                </div>
                            </>)

                    ))}


                    <div ref={messageEndRef} />
                    {/* 
                    <div className="message my_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. <br /><span>12:15</span></p>
                    </div>
                    <div className="message friend_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. <br /><span>12:15</span></p>
                    </div>
                    <div className="message my_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Eaque aliquid fugiat accusamus dolore qui vitae ratione optio sunt
                            <br /><span>12:15</span></p>
                    </div>
                    <div className="message friend_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. <br /><span>12:15</span></p>
                    </div>
                    <div className="message my_msg">
                        <p>Lorem ipsum dolor sit amet consectetur <br /><span>12:15</span></p>
                    </div>
                    <div className="message friend_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.<br /><span>12:15</span></p>
                    </div>
                    <div className="message my_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.<br /><span>12:15</span></p>
                    </div>
                    <div className="message friend_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.<br /><span>12:15</span></p>
                    </div>
                    <div className="message my_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.<br /><span>12:15</span></p>
                    </div>
                    <div className="message friend_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.<br /><span>12:15</span></p>
                    </div>
                    <div className="message my_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.<br /><span>12:15</span></p>
                    </div>
                    <div className="message friend_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.<br /><span>12:15</span></p>
                    </div>
                    <div className="message my_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.<br /><span>12:15</span></p>
                    </div>
                    <div className="message friend_msg">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.<br /><span>12:15</span></p>
                    </div> */}
                </div>

                {/* <!-- CHAT INPUT --> */}
                <div className="chat_input">
                    <input type='file' accept="image/png, image/jpg, image/jpeg" id="image" style={{ display: "none" }} />
                    <label htmlFor="image" >
                        <FontAwesomeIcon icon={faImage} onChange={e => setImg(e.target.files[0])} onClick={handleSendImg} />
                    </label>
                    <input type='file' id="video" accept="file" style={{ display: "none" }} />
                    <label htmlFor="video" >
                        <FontAwesomeIcon icon={faVideo} onChange={e => setVideo(e.target.files[0])} onClick={handleSendVideo} />
                    </label>
                    <ion-icon name="happy-outline"></ion-icon>
                    <input type="text" placeholder="Type a message" onChange={e => setText(e.target.value)} value={text} onKeyDown={handleSendEnter} />
                    <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendText} />
                </div>

            </div>
        </div>
    )
}

export default Middle

// - (Object.values(a[1]).pop().Response.dateAndTimeStamp)