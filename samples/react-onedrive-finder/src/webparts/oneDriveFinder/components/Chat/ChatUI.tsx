import { Button, Header,Avatar, Input,
  Chat, Divider,ChatItemProps,Dialog,
  ShorthandCollection,Provider,teamsTheme  } from '@fluentui/react-northstar';
import * as React from 'react';
import { IChatUIProps } from './IChatUIProps';
import { HttpClient,HttpClientResponse,AadHttpClient } from '@microsoft/sp-http';


const janeAvatar = {
  image: 'https://fllivesharepoc.azurewebsites.net/logo.png',
  status: {
    color: 'green'
  },
}

const ChatUI = (props: IChatUIProps) => {
  const [openPortal, setOpenPortal] = React.useState(false)
  const [inputMessage, setInputMessage] = React.useState("");
  const [messages, setMessages] = React.useState([{
    gutter: <Avatar {...janeAvatar} />,
    message: <Chat.Message content="Hello, you can chat with me about the document now" author="AI Bot" timestamp={new Date().toLocaleString()}/>
  }] as ShorthandCollection<ChatItemProps>);
  const onClick = () => setOpenPortal(!openPortal)


  const onSendClick = () => {
    console.log("onSendClick");
    if(props?.fileItem == null)
    {
      let newMessages = [...messages]
      newMessages.push({ message: <Chat.Message content="Please selecct a document firstly" author="AI Bot" timestamp={new Date().toLocaleString()} />,
      contentPosition: 'start',
      attached: 'top'});
      setMessages(newMessages);
    }
    else if(inputMessage.trim())
    {
      let newMessages = [...messages]
      newMessages.push({ message: (<Chat.Message content={inputMessage} mine timestamp={new Date().toLocaleString()}
       />),
      contentPosition: 'end'
      }
      );
      setMessages(newMessages);

      const parameters: {[key: string]: string} = {};
      parameters["prompt"] = inputMessage;
      parameters["targetPath"] = props.fileItem["@microsoft.graph.downloadUrl"] ;
      parameters["docId"] = props.fileItem.id+"_"+props.fileItem.file.hashes.quickXorHash;
      parameters["userId"] = /*user.ObjectId*/"commonusers";
      parameters["isSharePoint"] = "true";

      const spHttpClientOption = {
        body: JSON.stringify(parameters),
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        }};

      props.httpClient
            .post(process.env.REACT_APP_API_URL,
              HttpClient.configurations.v1,spHttpClientOption)
            .then((response: HttpClientResponse)=> {

              if (response.ok == true )
              {
                response.text().then((text) => {
                console.log("Submit successfully" + text);

                const str = text.replace(/^.*\s*Answer:\s*(.*)$/sm,"$1");
                const items1 = str.split("\n").map((item) => {
                  return <div key={item.trim()}>{item.trim()}</div>;
                });

                let newMessages2 = [...newMessages]
                newMessages2.push({
                  gutter: <Avatar {...janeAvatar} />,
                  message: (<Chat.Message content= {items1}
                 author="AI Bot" timestamp={new Date().toLocaleString()} />),
                contentPosition: 'start'
                });
                setMessages(newMessages2);
              });
              }
            }).catch(error =>
              {
                console.error(error)
            });
    }
    }

    function handleKeyDown(event) {
      if (event.keyCode === 13)
      {
        // 13 is the keycode for Enter
        console.log('Enter key pressed!');
        onSendClick();
        setInputMessage("");
        // Handle the Enter key press event here
      }
    }
  return (

    <Provider theme={teamsTheme}>
      <Dialog

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
        <Input type="text" id="myInput" onChange={(a,b)=>setInputMessage(b.value)}
        value={inputMessage}
        onKeyDown={handleKeyDown}
        placeholder='Type your message'
        fluid styles={{
          marginTop: '10px',
          marginBottom: '10px'
        }}/>
        <Button content="Send" onClick={onSendClick} styles={{
          marginRight: '10px'
        }}/>
      </>)
    }}

      header="Chat with Docs"
      trigger={<Button content="Open Chat" primary />}
    />

    </Provider>

  )
}

export default ChatUI;
