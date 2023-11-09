"use client"
import Layout from '@/components/Layout'
import CreateContract from '@/features/contracts/createContract'
import React from 'react'

export default function page() {
  return (
    <Layout>
      <CreateContract />
    </Layout>
  )
}
