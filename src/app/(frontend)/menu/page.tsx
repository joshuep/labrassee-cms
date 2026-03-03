import React from 'react'

import { getMenuItemsData } from '@/frontend/lib/payload-data'
import Menu from '@/frontend/pages/Menu'

export const revalidate = 300

export default async function MenuPage() {
  const menuItems = await getMenuItemsData()

  return <Menu menuItems={menuItems} />
}
