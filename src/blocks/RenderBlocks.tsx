import React, { Fragment } from 'react'

import type { Page, Project } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ChartBlock } from '@/blocks/ChartBlock/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQBlock } from '@/blocks/FAQBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GridBlock } from '@/blocks/GridBlock/Component'
import { FlexibleGridBlock } from '@/blocks/FlexibleGridBlock/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SpacerBlock } from '@/blocks/Spacer/Component'
import { StaffBlock } from '@/blocks/StaffBlock/Component'
import { SupportBlock } from '@/blocks/SupportBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  chartBlock: ChartBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faqBlock: FAQBlock,
  formBlock: FormBlock,
  gridBlock: GridBlock,
  flexibleGridBlock: FlexibleGridBlock,
  mediaBlock: MediaBlock,
  spacer: SpacerBlock,
  staffBlock: StaffBlock,
  supportBlock: SupportBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
