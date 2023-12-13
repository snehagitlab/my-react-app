import React from 'react';
import { EditorState, Modifier } from 'draft-js';

interface iTableAction {
  onChange: any,
    editorState: any
}

function VideoUrlEditor()  {
 

  /* addStar: Function = (): any => {
    const { editorState, onChange } = this.props;
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '⭐',
      editorState.getCurrentInlineStyle(),
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
  }; */

  const addStar = (props: iTableAction) => {
    const { editorState, onChange } = props;
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '⭐',
      editorState.getCurrentInlineStyle(),
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    }


   {
    return (
      <div onClick={()=>addStar}>⭐</div>
    );
  }
}

export default VideoUrlEditor


/* const EditorCustomToolbarOption = () => (
  <Editor
    wrapperClassName="demo-wrapper"
    editorClassName="demo-editor"
    toolbarCustomButtons={[<CustomOption />]}
  />
); */