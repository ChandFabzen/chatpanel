import React, { useState } from "react";
import '../components/middle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faSearch, faPaperclip, faFaceSmile, faPaperPlane, faSadCry } from '@fortawesome/free-solid-svg-icons'
import { db } from "../services/firebase";
import { ref, child, get } from "firebase/database"





const Middle = () => {


    //Start Search Chat
    const [userName, setUserName] = useState('')
    const [user, setUser] = useState(null)
    const [err, setErr] = useState(false)
    const [userId, setUserId] = useState('')

    // const { currentUser } = useContext(AuthContext);

    const handleSearch = () => {
        const dbRef = ref(db);
        get(child(dbRef, userName)).then((snapshot) => {
            if (snapshot.exists()) {
                //    const userNameTest =  (/^[A-Za-z0-9\!\@\#\$\%\^\&\*\)\(+\=\._-]+$/g).test(userName)
                //    if(userNameTest){
                //     setErr(true)
                //    }
                let data = snapshot.val()
                const formattedTasks = [];

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
        }).catch((error) => {
            console.log(error)
            setErr(true);
        });
        console.log(user)
    }




    const handleKey = e => {
        e.code === 'Enter' && handleSearch()
    }

    const handleSelect = () => {
        setUser(null)
        setUserName("")
    }

    // end Search chat


    // start chat fetch

    // end chat fetch
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



                {/* <!-- CHAT LIST --> */}
                <div className="chatlist">
                    {err && (<span>User not found!</span>)}
                    {user && (<div className="block active" onClick={handleSelect}>
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
                                <p>{user[user.length - 1].data.message}</p>
                            </div>
                        </div>
                    </div>)}

                    <div className="block unread">
                        <div className="imgBox">
                            <img src={require('../image/img3.jpg')} alt="" className="cover" />
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Andre</h4>
                                <p className="time">12:34</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                                <b>1</b>
                            </div>
                        </div>
                    </div>

                    <div className="block unread">
                        <div className="imgBox">
                            <img src={require('../image/img4.jpg')} alt="" className="cover" />
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Olivia</h4>
                                <p className="time">Yesterday</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                                <b>2</b>
                            </div>
                        </div>
                    </div>
                    <div className="block">
                        <div className="imgBox">
                            <img src={require('../image/img5.jpg')} alt="" className="cover" />
                        </div>
                        <div className="details">
                            <div className="listHead">
                                <h4>Parker</h4>
                                <p className="time">Yesterday</p>
                            </div>
                            <div className="message_p">
                                <p>Token No:</p>
                            </div>
                        </div>
                    </div>
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
                    </div>
                    <div className="block">
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
                    </div>
                    <div className="block">
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
                    </div>
                    <div className="block">
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
                    </div>
                    <div className="block">
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
                    </div>
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
                    </div>
                    <div className="block">
                        <div className="imgBox">
                            {/* <img src={profileImg} className="cover" alt=""/> */}
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
                            {/* <img src={profileImg} className="cover" alt=""/> */}
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
                </div>
            </div>
            <div className="rightSide">
                <div className="header">
                    <div className="imgText">
                        <div className="userimg">
                            <img src={require('../image/img6.jpg')} alt="" className="cover" />
                        </div>
                        <h4>Jhon<br />
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
                    <div className="message my_msg">
                        <p>Hi <br /><span>12:18</span></p>
                    </div>
                    <div className="message friend_msg">
                        <p>Hey <br /><span>12:18</span></p>
                    </div>
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
                    </div>
                </div>

                {/* <!-- CHAT INPUT --> */}
                <div className="chat_input">
                    <FontAwesomeIcon icon={faPaperclip} />
                    <FontAwesomeIcon icon={faFaceSmile} />
                    <ion-icon name="happy-outline"></ion-icon>
                    <input type="text" placeholder="Type a message" />
                    <FontAwesomeIcon icon={faPaperPlane} />
                </div>

            </div>
        </div>
    )
}

export default Middle