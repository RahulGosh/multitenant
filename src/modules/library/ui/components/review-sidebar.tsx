import React from 'react'
import { useReview } from '@/lib/hooks/use-api';
import ReviewForm from './review-form';

interface Props {
    productId: string
}

const ReviewSidebar = ({productId}: Props) => {
    const {data} = useReview(productId);

  return (
    <ReviewForm productId={productId} initialData={data} />
  )
}

export default ReviewSidebar
