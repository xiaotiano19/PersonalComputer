//富文本编辑器 组件封装做代码复用
//githup中cnpm install --save react-draft-wysiwyg draft-js导入


import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';//需要安装
import htmlToDraft from 'html-to-draftjs';//反转
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
export default function NewsEditor(props) {
    useEffect(() => {
        // console.log(props.content)
        //怎么把html代码片段转回成draft对象 从而到editorstate上
        //用html-to-draftjs 
        const html = props.content;
        if (html === undefined) return; //解决HTML为空时trim（）报错问题
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.content]) //拿到以前撰写新闻时候的html代码片段
    const [editorState, setEditorState] = useState("")
    return (

        <div>
            <Editor
                editorState={editorState}  //1
                toolbarClassName="toolbarClassName"//2
                wrapperClassName="wrapperClassName"//3
                editorClassName="editorClassName"//4 //2 3 4为控制样式的
                onEditorStateChange={(editorState) =>
                    setEditorState(editorState)}  //5  1和5让Editor成为受控组件
                onBlur={() => {//失去焦点时候拿到输入状态值
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))//通过回调将子组件状态值传递给父组件

                }}
            />
        </div>
    )
}
