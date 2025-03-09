export interface GiphyResponse {
  data: GiphyGif[]
  meta: {
    status: number
    msg: string
    response_id: string
  }
  pagination: {
    total_count: number
    count: number
    offset: number
  }
}

export interface GiphyGif {
  type: string
  id: string
  url: string
  slug: string
  bitly_gif_url: string
  bitly_url: string
  embed_url: string
  username: string
  source: string
  title: string
  rating: string
  content_url: string
  source_tld: string
  source_post_url: string
  is_sticker: number
  import_datetime: string
  trending_datetime: string
  images: GiphyImages
  analytics_response_payload: string
  analytics: {
    onload: { url: string }
    onclick: { url: string }
    onsent: { url: string }
  }
  alt_text: string
}

export interface GiphyImages {
  'original': GiphyImage
  'downsized': GiphyImage
  'downsized_large': GiphyImage
  'downsized_medium': GiphyImage
  'downsized_small': GiphyVideoImage
  'downsized_still': GiphyImage
  'fixed_height': GiphyCompleteImage
  'fixed_height_downsampled': GiphyDownsampledImage
  'fixed_height_small': GiphyCompleteImage
  'fixed_height_small_still': GiphyImage
  'fixed_height_still': GiphyImage
  'fixed_width': GiphyCompleteImage
  'fixed_width_downsampled': GiphyDownsampledImage
  'fixed_width_small': GiphyCompleteImage
  'fixed_width_small_still': GiphyImage
  'fixed_width_still': GiphyImage
  'looping': {
    mp4_size: string
    mp4: string
  }
  'original_still': GiphyImage
  'original_mp4': GiphyVideoImage
  'preview': {
    height: string
    width: string
    mp4_size: string
    mp4: string
  }
  'preview_gif': GiphyImage
  'preview_webp': GiphyImage
  '480w_still': GiphyImage
}

interface GiphyImage {
  height: string
  width: string
  size: string
  url: string
}

interface GiphyCompleteImage extends GiphyImage {
  mp4_size: string
  mp4: string
  webp_size: string
  webp: string
}

interface GiphyDownsampledImage extends GiphyImage {
  webp_size: string
  webp: string
}

interface GiphyVideoImage {
  height: string
  width: string
  mp4_size: string
  mp4: string
}
