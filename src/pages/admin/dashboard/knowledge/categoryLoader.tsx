import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props: any) => (
    <ContentLoader
        speed={3}
        width={500}
        height={95}
        viewBox="50 10 500 95"
        backgroundColor="#d9d9d9"
        foregroundColor="#ededed"
        {...props}
    >
        <rect x="50" y="10" rx="2" ry="4" width="500" height="95" />

    </ContentLoader>
)

export default MyLoader