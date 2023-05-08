import React, { ReactElement } from 'react'

function Section({ children }: { children: ReactElement }) {
  return <section style={{ margin: '30px 0px' }}>{children}</section>
}

export default Section
