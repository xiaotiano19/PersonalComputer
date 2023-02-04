import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';  //富文本编辑器
import draftToHtml from 'draftjs-to-html';//需要安装
import htmlToDraft from 'html-to-draftjs';//反转
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
export default function NewsEditor(props) {
    useEffect(() => {
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
    }, [props.content])
    const [editorState, setEditorState] = useState('')
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
