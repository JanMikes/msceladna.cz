const mediaFields = { fields: ['url', 'alternativeText', 'width', 'height', 'name', 'ext', 'size'] };

const textLinkPopulate = {
  populate: {
    page: { fields: ['slug'] },
    file: mediaFields,
  },
};

const buttonPopulate = {
  populate: {
    link: textLinkPopulate,
  },
};

const documentItemPopulate = {
  populate: {
    file: mediaFields,
  },
};

const photoPopulate = {
  populate: {
    image: mediaFields,
  },
};

const slidePopulate = {
  populate: {
    link: textLinkPopulate,
    image: mediaFields,
    background_image: mediaFields,
  },
};

const contactCardPopulate = {
  populate: {
    photo: mediaFields,
    icon_1: mediaFields,
    icon_2: mediaFields,
    icon_3: mediaFields,
  },
};

const expandableSectionPopulate = {
  populate: {
    files: documentItemPopulate,
    photos: photoPopulate,
    contacts: contactCardPopulate,
  },
};

const featureCardPopulate = {
  populate: {
    icon: mediaFields,
    link: textLinkPopulate,
    icon_1: mediaFields,
    icon_2: mediaFields,
    icon_3: mediaFields,
  },
};

const bannerCardPopulate = {
  populate: {
    link: textLinkPopulate,
    image: mediaFields,
    icon_1: mediaFields,
    icon_2: mediaFields,
    icon_3: mediaFields,
    icon_4: mediaFields,
    icon_5: mediaFields,
    icon_6: mediaFields,
    icon_7: mediaFields,
  },
};

const partnerLogoPopulate = {
  populate: {
    logo: mediaFields,
  },
};

const workplaceCardPopulate = {
  populate: {
    image: mediaFields,
    icon_1: mediaFields,
    icon_2: mediaFields,
    icon_3: mediaFields,
    link: textLinkPopulate,
  },
};

function buildDynamicZonePopulate() {
  return {
    on: {
      'components.text': { populate: '*' },
      'components.heading': { populate: '*' },
      'components.alert': { populate: '*' },
      'components.links-list': {
        populate: {
          links: textLinkPopulate,
        },
      },
      'components.video': { populate: '*' },
      'components.feature-cards': {
        populate: {
          cards: featureCardPopulate,
        },
      },
      'components.banner-cards': {
        populate: {
          cards: bannerCardPopulate,
        },
      },
      'components.documents': {
        populate: {
          documents: documentItemPopulate,
        },
      },
      'components.partner-logos': {
        populate: {
          partners: partnerLogoPopulate,
        },
      },
      'components.stats-highlights': {
        populate: {
          items: {
            populate: {
              icon_1: mediaFields,
              icon_2: mediaFields,
              icon_3: mediaFields,
            },
          },
        },
      },
      'components.stats-section': {
        populate: {
          link: textLinkPopulate,
          items: {
            populate: {
              icon_1: mediaFields,
              icon_2: mediaFields,
              icon_3: mediaFields,
            },
          },
        },
      },
      'components.timeline': {
        populate: {
          items: { populate: '*' },
        },
      },
      'components.section-divider': { populate: '*' },
      'components.gallery-slider': {
        populate: {
          photos: photoPopulate,
        },
      },
      'components.photo-gallery': {
        populate: {
          photos: photoPopulate,
        },
      },
      'components.button-group': {
        populate: {
          buttons: buttonPopulate,
        },
      },
      'components.contact-cards': {
        populate: {
          cards: contactCardPopulate,
        },
      },
      'components.accordion-sections': {
        populate: {
          sections: expandableSectionPopulate,
        },
      },
      'components.popup': {
        populate: {
          link: textLinkPopulate,
        },
      },
      'components.badges': {
        populate: {
          badges: { populate: '*' },
        },
      },
      'components.image': {
        populate: {
          image: mediaFields,
        },
      },
      'components.news-articles': {
        populate: {
          show_all_link: textLinkPopulate,
        },
      },
      'components.workplace-cards': {
        populate: {
          cards: workplaceCardPopulate,
        },
      },
      'components.employee-cards': { populate: '*' },
      'components.map': { populate: '*' },
      'components.form': {
        populate: {
          form: {
            populate: {
              inputGroups: {
                populate: {
                  inputs: { populate: '*' },
                },
              },
            },
          },
          recipients: { populate: '*' },
        },
      },
      'components.card-slider': {
        populate: {
          items: {
            populate: {
              icon: mediaFields,
              link: textLinkPopulate,
            },
          },
        },
      },
      'components.hero-slider': {
        populate: {
          slides: {
            populate: {
              link: textLinkPopulate,
              image: mediaFields,
              informations: {
                populate: {
                  icon: mediaFields,
                },
              },
            },
          },
        },
      },
      'components.slider': {
        populate: {
          slides: slidePopulate,
        },
      },
    },
  };
}

function buildParentPopulate(depth: number): Record<string, unknown> {
  if (depth <= 1) {
    return { parent: { fields: ['title', 'slug'] } };
  }
  return { parent: { fields: ['title', 'slug'], populate: buildParentPopulate(depth - 1) } };
}

export function buildPagePopulate() {
  return {
    content: buildDynamicZonePopulate(),
    sidebar: buildDynamicZonePopulate(),
    ...buildParentPopulate(5),
    menu_set: { fields: ['documentId'] },
  };
}

export function buildFooterPopulate() {
  return {
    linkSections: {
      populate: {
        links: textLinkPopulate,
      },
    },
    bottomLinks: textLinkPopulate,
  };
}

export function buildNavigationPopulate() {
  return {
    link: {
      populate: {
        page: { fields: ['slug'] },
        file: mediaFields,
      },
    },
    children: {
      populate: {
        link: {
          populate: {
            page: { fields: ['slug'] },
            file: mediaFields,
          },
        },
      },
    },
    menu_set: { fields: ['documentId'] },
  };
}

export function buildNewsArticlePopulate() {
  return {
    mainPhoto: mediaFields,
    gallery: mediaFields,
    files: mediaFields,
    workplaces: { fields: ['name', 'slug'] },
    tags: { fields: ['name', 'slug'] },
  };
}

export function buildWorkplacePopulate() {
  return '*' as const;
}

export function buildEmployeePopulate() {
  return {
    photo: mediaFields,
    workplace: { fields: ['name', 'slug'] },
  };
}

export function buildProjectPopulate() {
  return {
    logos: mediaFields,
    publicityPoster: mediaFields,
    workplaces: { fields: ['name', 'slug'] },
  };
}
