import * as React from 'react'
import { useState } from 'react'
import KnowledgeContext from './knowledgeProvider'
import { EditorState } from 'draft-js'

const OrganisationState = (props: any) => {
  const [categoryopen, setCategoryopen] = useState(false)
  const [createtemplatelist, setCreateTemplateList] = useState(false)
  const [firstmodalopen, setfirstmodalOpen] = useState<boolean>(false)
  const [categoryIdforAddArticle, setcategoryIdforAddArticle] = useState(0)
  const [folderIdaddarticle, setfolderIdaddarticle] = useState(0)
  const [addTagaddarticle, setaddTagaddarticle] = useState('')
  const [addDescriptionTemplateaddarticle, setaddDescriptionTemplateaddarticle] = useState('')
  const [applyTemplateID, setApplyTemplateID] = useState(0)
  const [selectedTemplateId, setSelectedTemplateId] = useState(0)
  const [previewArticleId, setPreviewArticleId] = React.useState(0)
  const [draftArticleCatId, setDraftArticleCatId] = React.useState(0)
  const [draftArticleFolderId, setDraftArticleFolderId] = React.useState(0)
  const [draftArticleaddTag, setDraftArticleaddTag] = useState('')
  const [createCategory, setCreateCategory] = useState<any>()
  const [categoryIdaddarticle, setCategoryIdaddarticle] = useState(0)
  const [refreshAddArticleform, setRefreshAddArticleform] = useState(false)
  const [refreshsidebarright, setRefreshsidebarright] = useState(false)
  const [getDraft, setgetdraft] = useState<any>();
  const [folderId, setFolderId] = useState()
  const [categoryId, setCategoryId] = useState()
  const [folderAddcatId, setFolderAddcatId] = useState()
  const [folderEditDialogue, setFolderEditDialogue] = useState(false)
  const [catId, setCatId] = useState<any>(1)
  const [loading, setLoading] = useState(false)
  const [draftLoading, setDraftLoading] = useState(false)

  //route state
  const [draftDisplay, setDraftDisplay] = useState()
  const [categoryname, setCategoryName] = useState()
  const [folderCatname, setFolderCatname] = useState()
  const [foldername, setFolderName] = useState()


  const [FirstCatFolder, setFirstCatFolder] = useState(false)
  const [ShowDescription, setShowDescription] = useState(false)


  //used catId direction path
  const [catIdDirection, setCatIdDirection] = useState<any>()


  //state uised for edit folder
  const [editFolderName, setEditFolderName] = useState('')
  const [editFolderDescription, setEditFolderDescription] = useState("")
  const [roleId, setRoleId] = useState()
  const [editFolderId, seteditFolderId] = useState();
  const [editFolderCatId, seteditFolderCatId] = useState();
  const [description, setDescription] = useState(EditorState.createEmpty())


  //used state for admin
  const [addFolder, setAddFolder] = useState<any>()
  const [scrollId, setScrollId] = useState()
  const myRef: any = React.useRef(null)

  // Video Id
  const [articleVideoId , setarticleVideoId] = useState(0)
  const [KbAccess, setKbAccess] = useState('')
  const [userRole, setUserRole] = useState(0)
  const [dispArticleBackBtn, setdispArticleBackBtn] = useState(false)

  return (
    <>
      <KnowledgeContext.Provider
        value={{
          categoryopen,
          setCategoryopen,
          createtemplatelist,
          setCreateTemplateList,
          firstmodalopen,
          setfirstmodalOpen,
          categoryIdforAddArticle,
          setcategoryIdforAddArticle,
          folderIdaddarticle,
          setfolderIdaddarticle,
          addTagaddarticle,
          setaddTagaddarticle,
          addDescriptionTemplateaddarticle,
          setaddDescriptionTemplateaddarticle,
          applyTemplateID,
          setApplyTemplateID,
          selectedTemplateId,
          setSelectedTemplateId,
          setAddFolder,
          addFolder,
          previewArticleId,
          setPreviewArticleId,
          draftArticleCatId,
          setDraftArticleCatId,
          draftArticleFolderId,
          setDraftArticleFolderId,
          draftArticleaddTag,
          setDraftArticleaddTag,
          setCreateCategory,
          createCategory,
          categoryIdaddarticle,
          setCategoryIdaddarticle,
          refreshAddArticleform,
          setRefreshAddArticleform,
          refreshsidebarright,
          setRefreshsidebarright,
          setgetdraft,
          getDraft,
          setFolderId,
          folderId,
          setCatId,
          catId,
          setCategoryId,
          categoryId,
          setFolderAddcatId,
          folderAddcatId,
          setFolderEditDialogue,
          folderEditDialogue,
          setEditFolderName,
          editFolderName,
          setEditFolderDescription,
          editFolderDescription,
          seteditFolderId,
          editFolderId,
          seteditFolderCatId,
          editFolderCatId,
          setCatIdDirection,
          catIdDirection,
          draftLoading,
          setDraftLoading,
          setLoading,
          loading,
          draftDisplay,
          setDraftDisplay,
          categoryname,
          setCategoryName,
          folderCatname,
          setFolderCatname,
          foldername,
          setFolderName,
          roleId,
          setRoleId,
          FirstCatFolder,
          setFirstCatFolder,
          description,
          setDescription,
          ShowDescription,
          setShowDescription,
          scrollId,
          setScrollId,
          myRef,
          articleVideoId , 
          setarticleVideoId,
          KbAccess, 
          setKbAccess,
          userRole, 
          setUserRole,
          dispArticleBackBtn, 
          setdispArticleBackBtn
        }}
      >
        {props.children}
      </KnowledgeContext.Provider>
    </>
  )
}

export default OrganisationState
