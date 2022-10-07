import React, { useEffect, useRef, useState } from "react";
import '../components/middle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faSearch, faPaperPlane, faVideo, faImage, faRotateForward } from '@fortawesome/free-solid-svg-icons'
import { db, auth, storage } from "../services/firebase";
import { ref, onValue, push, set, update, query } from "firebase/database"
// import{ ref} from "firebase/storage";

import {
    onAuthStateChanged
} from "firebase/auth";
import moment from "moment";
import { ref as ref_storage, getDownloadURL, uploadBytesResumable } from "firebase/storage";









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


    // const { currentUser } = useContext(AuthContext);
    const [agent, setAgent] = useState('');

    const [uploadErr, setUploadErr] = useState(false)

    // const [status, setStatus] = useState(null)

    const messageEndRef = useRef(null);

    const [active, setActive] = useState(false)

    const [progress , setProgress] = useState(0)


    const handleStatusOptions = () => {
        console.log(active)
        if (active) {
            setActive(false)
        } else {
            setActive(true)
        }
    }

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
                console.log(formattedTasks)
                setUser(formattedTasks)
                setUserId(userName)
                setErr(false)

            } else {
                setErr(true)
            }


        });


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
        console.clear()
        const starCountRef = ref(db);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setChats(data)

        });

    }, [])

    // Open left chat fetch
    const fiterChatHandel = (e) => {
        e.preventDefault();
        console.log(chats)
        console.log(e.target.value)
        const starCountRef = ref(db);
        onValue(starCountRef, (snapshot) => {
            const chatss = snapshot.val();

            let obj = {}
            const keys = Object.keys(chatss)

            for (let i = 0; i < keys.length; i++) {
                const mostViewedPosts = query(ref(db, `${keys[i]}/UserChatData`));

                onValue(mostViewedPosts, (snapshot) => {
                    const data = snapshot.val();
                    if (data.chatStatus === Number(e.target.value)) {


                        const starCountRef = ref(db, keys[i]);
                        onValue(starCountRef, (snapshot) => {
                            const data = snapshot.val();

                            obj[`${keys[i]}`] = data
                        });
                    }

                });
                setChats(obj)
            }

        });




    }

    const handleRefresh = (e) => {
        window.location.reload();

    }
    // end left chat fetch

    // start right chat
    const handleChat = (u) => {
        setChatUserName(u)

        const starCountRef = ref(db, u);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            setUserMsg(data.Messages)
            //    console.log(userMsg)
        });


        // update notification

        const starCountRefs = ref(db, `${u}/UserChatData`);
        onValue(starCountRefs, (snapshot) => {
            const data = snapshot.val();
            const postData = {
                chatStatus: data.chatStatus,
                phoneNumber: data.phoneNumber,
                userid: data.userid,
                username: data.username,
                messageCountUpdate: 0
            };
            const updates = {};
            updates[`${u}/UserChatData`] = postData;
            update(ref(db), updates)

        });

    }

    // end of right chat

    // start sending chat and image


    const handleSendEnter = e => {
        if (text.trim().length > 0) {
            (e.code === "Enter" || e.code === "NumpadEnter") && handleSendText()
        }

    }

    const handleSendText = () => {
        let userinfo = Object.entries(userMsg)
        let lastMsgFullDate = userinfo[userinfo.length - 1][1].Response.dateAndTime
        let lastMsgDate = lastMsgFullDate.split(" ")[0].split("-")[0]
        let newDate = new Date()
        let newMsgDate = newDate.getDate();
        let updateHasDate = false
        const postListRef = ref(db, `${chatUserName}/Messages`);

        if (lastMsgDate < newMsgDate) {
            updateHasDate = true
        }
        if (text) {
            if (text.trim().length > 0) {
                // console.log(new Date().getTime())

                const newPostRef = push(postListRef);
                set(newPostRef, {
                    Response: {
                        name: agent.uid,
                        message: text,
                        hasImage: false,
                        hasVideo: false,
                        localURL: "",
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


    }

    const handleSendimg = (img) => {
        let userinfo = Object.entries(userMsg)
        let lastMsgFullDate = userinfo[userinfo.length - 1][1].Response.dateAndTime
        let lastMsgDate = lastMsgFullDate.split(" ")[0].split("-")[0]
        let newDate = new Date()
        let newMsgDate = newDate.getDate();
        let updateHasDate = false

        if (lastMsgDate < newMsgDate) {
            updateHasDate = true
        }

        const storageRef = ref_storage(storage, `${img.name}`);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                  setProgress(progress)
                switch (snapshot.state) {
                    case 'paused':
                        alert('Upload is paused');
                        break;
                    case 'running':
                        console.log(`Upload is running ${progress}%`);
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                alert(error)
                setUploadErr('true')
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    alert('File Uploaded');
                    setProgress(0)
                    const postListRef = ref(db, `${chatUserName}/Messages`);
                    const newPostRef = push(postListRef);
                    console.log(newPostRef)

                    set(newPostRef, {
                        Response: {
                            name: agent.uid,
                            message: downloadURL,
                            hasImage: true,
                            hasVideo: false,
                            hasDate: updateHasDate,
                            dateAndTime: `${moment().format("DD-MM-YYYY HH:mm:ss")}`,
                            dateAndTimeStamp: `${new Date().getTime()}`,
                            localURL: "",
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
                });
            }
        );

       

    }


    const handleSendvideo = (video) => {
        let userinfo = Object.entries(userMsg)
        let lastMsgFullDate = userinfo[userinfo.length - 1][1].Response.dateAndTime
        let lastMsgDate = lastMsgFullDate.split(" ")[0].split("-")[0]
        let newDate = new Date()
        let newMsgDate = newDate.getDate();
        let updateHasDate = false

        if (lastMsgDate < newMsgDate) {
            updateHasDate = true
        }

        const storageRef = ref_storage(storage, `${video.name}`);
        const uploadTask = uploadBytesResumable(storageRef, video);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress)
                switch (snapshot.state) {
                    case 'paused':
                        alert('Upload is paused');
                        break;
                    case 'running':
                        console.log(`Upload is running ${progress}%`);
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                alert(error)
                setUploadErr('true')
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setProgress(0)
                    alert('File Uploaded');
                    const postListRef = ref(db, `${chatUserName}/Messages`);
                    const newPostRef = push(postListRef);
                    console.log(newPostRef)

                    set(newPostRef, {
                        Response: {
                            name: agent.uid,
                            message: downloadURL,
                            hasImage: false,
                            hasVideo: true,
                            hasDate: updateHasDate,
                            dateAndTime: `${moment().format("DD-MM-YYYY HH:mm:ss")}`,
                            dateAndTimeStamp: `${new Date().getTime()}`,
                            localURL: "",
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
                });
            }
        );

      

    }

    const handleStatus = (status) => {
        // console.log(chatUserName)
        // console.log(status)
        console.log(status)
        alert('Process Start don`t press any key')
        const starCountRef = ref(db, `${chatUserName}/UserChatData`);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            const postData = {
                chatStatus: status,
                phoneNumber: chatUserName,
                userid: data.userid,
                username: data.username,
                messageCountUpdate: 0
            };
            const updates = {};
            updates[`${chatUserName}/UserChatData`] = postData;
            update(ref(db), updates)
            if (!update) {
                alert('Process Incompleted')
            }

        });
        window.location.reload();
        return
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
                            <FontAwesomeIcon icon={faRotateForward} onClick={handleRefresh} />
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
                            <img src={require('../image/img1.jpg')} alt="" className="cover" />
                            {/* <span>{currentUser.uid}</span> */}
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>{userId}</h4>
                                <p className="time">{user[user.length - 1].data.dateAndTime}</p>

                            </div>
                            <div className="message_p">
                                {/* <p>{user[user.length - 1].data.message}</p> */}
                            </div>
                        </div>
                    </div>)}

                    {/* <!-- CHAT LIST --> */}


                    <>
                        <div className="row" style={{ backgroundColor: "sliver" }} >
                            <button className="column" value={0} onClick={fiterChatHandel}>
                                Open
                            </button>
                            <button className="column" value={1} onClick={fiterChatHandel}>
                                Pending
                            </button>
                            <button className="column" value={3} onClick={fiterChatHandel}>
                                Mute
                            </button>
                            <button className="column" value={2} onClick={fiterChatHandel}>
                                Close
                            </button>
                        </div>
                        {Object.entries(chats).sort((a, b) => (Object.values(Object.values(b[1])[0]).pop().Response.dateAndTimeStamp) - (Object.values(Object.values(a[1])[0]).pop().Response.dateAndTimeStamp)).map((chat) => (<>

                            <div className="block" key={chat[0]} onClick={() => handleChat(chat[0])}>

                                <div className="imgBox" >
                                    <img src={require('../image/img5.jpg')} alt="" className="cover" />
                                </div>
                                <div className="details" >
                                    <div className="listHead" >
                                        <h4>{chat[0]}</h4>
                                        <p className="time" key={chat[1]}>{Object.values(Object.values(chat[1])[0]).pop().Response.dateAndTime}</p>
                                    </div>


                                    {Object.values(Object.values(chat[1])[0]).pop().Response.hasVideo || Object.values(Object.values(chat[1])[0]).pop().Response.hasImage ?
                                        (Object.values(Object.values(chat[1])[0]).pop().Response.hasVideo ?
                                            (<div className="message_p">
                                                <p>Video</p>
                                                {
                                                    Object.values(Object.values(chat[1])[1])[0] <= 2 ?
                                                        Object.values(Object.values(chat[1])[1])[0] === 0 || Object.values(Object.values(chat[1])[1])[0] === 1 ?
                                                            Object.values(Object.values(chat[1])[1])[0] === 0 ?
                                                                (<><><b style={{ backgroundColor: "green" }}>Open</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</></>)
                                                                :
                                                                (<><><b style={{ backgroundColor: "yellow" }}>Pending</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</></>)

                                                            :
                                                            (<><b style={{ backgroundColor: "red" }}>Close</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</>)
                                                        :
                                                        (<><b style={{ backgroundColor: "brown" }}>Mute</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</>)
                                                }

                                            </div>)
                                            :
                                            (<div className="message_p">
                                                <p>Image</p>
                                                {
                                                    Object.values(Object.values(chat[1])[1])[0] <= 2 ?
                                                        Object.values(Object.values(chat[1])[1])[0] === 0 || Object.values(Object.values(chat[1])[1])[0] === 1 ?
                                                            Object.values(Object.values(chat[1])[1])[0] === 0 ?
                                                                (<><><b style={{ backgroundColor: "green" }}>Open</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</></>)
                                                                :
                                                                (<><><b style={{ backgroundColor: "yellow" }}>Pending</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</></>)

                                                            :
                                                            (<><b style={{ backgroundColor: "red" }}>Close</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</>)
                                                        :
                                                        (<><b style={{ backgroundColor: "brown" }}>Mute</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</>)
                                                }
                                            </div>))
                                        :
                                        (<div className="message_p">
                                            <p>{Object.values(Object.values(chat[1])[0]).pop().Response.message}</p>
                                            {
                                                Object.values(Object.values(chat[1])[1])[0] <= 2 ?
                                                    Object.values(Object.values(chat[1])[1])[0] === 0 || Object.values(Object.values(chat[1])[1])[0] === 1 ?
                                                        Object.values(Object.values(chat[1])[1])[0] === 0 ?
                                                            (<><><b style={{ backgroundColor: "green" }}>Open</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</></>)
                                                            :
                                                            (<><><b style={{ backgroundColor: "yellow" }}>Pending</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</></>)

                                                        :
                                                        (<><b style={{ backgroundColor: "red" }}>Close</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</>)
                                                    :
                                                    (<><b style={{ backgroundColor: "brown" }}>Mute</b>{Object.values(Object.values(chat[1])[1])[1] > 0 ? (<><b>{Object.values(Object.values(chat[1])[1])[1]}</b></>) : (<></>)}</>)
                                            }
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

                {chatUserName.trim().length !== 0 && (<>
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
                                {active === false ? (<> <ul className="nav_icons">
                                    <li>
                                        <b style={{ background: "red", borderRadius: "10%", height: "35px" }} key={chatUserName} onClick={(e) => handleStatus(e.target.value = 0)}>Open</b>
                                    </li>
                                    <li>
                                        <b style={{ background: "orange", borderRadius: "10%", height: "35px" }} key={chatUserName} onClick={(e) => handleStatus(e.target.value = 1)}>Pending</b>
                                    </li>
                                    <li>
                                        <b style={{ background: "green", borderRadius: "10%", height: "35px" }} key={chatUserName} onClick={(e) => handleStatus(e.target.value = 2)}>Close</b>
                                    </li>
                                    <li>
                                        <b style={{ background: "brown", borderRadius: "10%", height: "35px" }} key={chatUserName} onClick={(e) => handleStatus(e.target.value = 3)}>Mute</b>
                                    </li>
                                </ul></>) : (<></>)}
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faEllipsisVertical} onClick={handleStatusOptions} />
                            </li>
                        </ul>

                    </div>
                </>)}



                {/* <!-- CHAT-BOX --> */}
                <div className="chatbox">
                    {chatUserName.trim().length === 0 && (<>
                        <div className="Empty_Right_Side">
                            <h1>Please Select An User To Chat</h1>
                        </div>
                    </>)}
                    
                    <>
                        {Object.entries(userMsg).map((userMsg) => (

                            userMsg[1].Response.responseType === 1 ?
                                (<>
                                    <div className="message my_msg">

                                        {userMsg[1].Response.hasImage || userMsg[1].Response.hasVideo ?
                                            userMsg[1].Response.hasImage ? (<><img className="img" src={userMsg[1].Response.message} alt="Agent" /><span className="imgTime">{userMsg[1].Response.dateAndTime.split(' ')[1]}</span></>)
                                                :
                                                (<>
                                                    < video width="500" height="350" controls >
                                                        <source src={userMsg[1].Response.message} type="video/mp4" />
                                                    </video >
                                                    <span className="videoTime">{userMsg[1].Response.dateAndTime.split(' ')[1]}</span>
                                                </>
                                                )
                                            :
                                            (<><p>{userMsg[1].Response.message}<br /><span>{userMsg[1].Response.dateAndTime.split(' ')[1]}</span></p></>)}

                                    </div>
                                </>)
                                :
                                (<>
                                    <div className="message friend_msg">
                                        {userMsg[1].Response.hasImage || userMsg[1].Response.hasVideo ?
                                            userMsg[1].Response.hasImage ? (<><img className="img" src={userMsg[1].Response.message} alt="user" /><span className="imgTime">{userMsg[1].Response.dateAndTime.split(' ')[1]}</span></>)
                                                :
                                                (<> < video width="300" height="350" controls >
                                                    <source src={userMsg[1].Response.message} type="video/mp4" />
                                                </video >
                                                    <span className="videoTime">{userMsg[1].Response.dateAndTime.split(' ')[1]}</span>
                                                </>)
                                            :
                                            (<><p>{userMsg[1].Response.message}<br /><span>{userMsg[1].Response.dateAndTime.split(' ')[1]}</span></p></>)}

                                    </div>
                                </>)

                        ))}
                    </>

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
                    {err && (<>
                        <div className="Empty_Right_Side">
                            <h1>Unable to send Image Or Video</h1>
                        </div>
                    </>)}
                    {chatUserName.trim().length !== 0 && (<>
                        <input type='file' accept="image/png, image/jpg, image/jpeg" id="image" style={{ display: "none" }} onChange={e => handleSendimg(e.target.files[0])} />
                        <label htmlFor="image">
                           {progress>0?<h4>{`${progress}%`}</h4>:<></>} 
                            <FontAwesomeIcon icon={faImage} />
                        </label>

                        <input type='file' id="video" accept="video/mp4,video/x-m4v,video/*" style={{ display: "none" }} onChange={e => handleSendvideo(e.target.files[0])} />
                        <label htmlFor="video" >
                        
                            <FontAwesomeIcon icon={faVideo} />
                        </label>


                        <input type="text" placeholder="Type a message" onChange={e => setText(e.target.value)} value={text} onKeyDown={handleSendEnter} />
                        <FontAwesomeIcon icon={faPaperPlane} onClick={handleSendText} />
                    </>)}


                </div>

            </div>
        </div>
    )
}

export default Middle












