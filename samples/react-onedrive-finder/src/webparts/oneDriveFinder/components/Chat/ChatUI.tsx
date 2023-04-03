import { Button, Header,Avatar, Input,
  Chat, Divider,ChatItemProps,Dialog,
  ShorthandCollection,Provider,teamsTheme  } from '@fluentui/react-northstar';
import * as React from 'react';


const ChatUI = () => {
  const [openPortal, setOpenPortal] = React.useState(false)
  const [inputMessage, setInputMessage] = React.useState("");
  const [messages, setMessages] = React.useState([] as ShorthandCollection<ChatItemProps>);
  const onClick = () => setOpenPortal(!openPortal)
  const janeAvatar = {
    image: 'public/images/avatar/small/ade.jpg',
    status: {
      color: 'green'
    },
  }

  const onSendClick = () => {
    console.log("onSendClick"+ {inputMessage});
    let newMessages = [...messages]
    newMessages.push({ message: <Chat.Message content={"test: "+inputMessage} mine timestamp={new Date().toLocaleString()} />,
    contentPosition: 'end',
    attached: 'top'});
    setMessages(newMessages);
    }


  return (

    <Provider theme={teamsTheme}>
      <Dialog
      confirmButton="Okay"
      content={{
        content: (<>
        <div
        style={{
          // keep only 1 scrollbar while zooming
          height: '300px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse'
        }}>
          <Chat items={messages} />
        </div>
        <Input type="text" id="myInput" onChange={(a,b)=>setInputMessage(b.value)}/>
        <Button content="Send" onClick={onSendClick}/>
      </>)
    }}

      header="Chat with Docs"
      trigger={<Button content="Open Chat" />}
    />

    </Provider>

  )
}

export default ChatUI;
