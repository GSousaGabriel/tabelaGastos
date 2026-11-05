import { definePreset } from "@primeng/themes";
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{teal.50}',
            100: '{teal.100}',
            200: '{teal.200}',
            300: '{teal.300}',
            400: '{teal.400}',
            500: '{teal.500}',
            600: '{teal.600}',
            700: '{teal.700}',
            800: '{teal.800}',
            900: '{teal.900}',
            950: '{teal.950}'
        },
        colorScheme: {
            light: {
                // Teal 700 keeps white button labels above the WCAG AA contrast ratio.
                primary: {
                    color: '{primary.700}',
                    hoverColor: '{primary.800}',
                    activeColor: '{primary.900}'
                },
                formField: {
                    borderColor: '{surface.400}',
                    hoverBorderColor: '{surface.500}'
                },
                content: {
                    borderColor: '{surface.400}'
                }
            },
            dark: {
                // Off-white text is easier on the eyes than pure white on a dark surface.
                text: {
                    color: '{surface.100}'
                },
                formField: {
                    borderColor: '{surface.500}',
                    hoverBorderColor: '{surface.400}',
                    color: '{surface.100}'
                },
                content: {
                    borderColor: '{surface.600}'
                }
            }
        }
    },
    components: {
        button: {
            colorScheme: {
                light: {
                    root: {
                        secondary: {
                            background: '{surface.200}',
                            hoverBackground: '{surface.300}',
                            borderColor: '{surface.400}',
                            hoverBorderColor: '{surface.500}',
                            activeBorderColor: '{surface.500}',
                            color: '{surface.700}'
                        }
                    }
                },
                dark: {
                    root: {
                        secondary: {
                            borderColor: '{surface.500}',
                            hoverBorderColor: '{surface.400}',
                            activeBorderColor: '{surface.400}',
                            color: '{surface.100}'
                        }
                    }
                }
            }
        },
        select: {
            colorScheme: {
                // PrimeNG focuses the option under the mouse, so this is also the hover colour.
                light: {
                    option: {
                        focusBackground: '{primary.200}'
                    }
                },
                dark: {
                    option: {
                        focusBackground: '{primary.800}'
                    }
                }
            }
        },
        datatable: {
            colorScheme: {
                light: {
                    headerCell: {
                        background: '#b4b9bf',
                        hoverBackground: '#c4c9cf',
                        color: '{surface.950}'
                    }
                },
                dark: {
                    root: {
                        borderColor: '{content.border.color}'
                    },
                    headerCell: {
                        background: '{surface.800}',
                        hoverBackground: '{surface.700}',
                        color: '{surface.100}'
                    }
                }
            }
        },
        progressbar: {
            root: {
                height: '0.5rem'
            },
            colorScheme: {
                light: {
                    root: {
                        background: '{primary.200}'
                    }
                },
                dark: {
                    root: {
                        background: '{primary.900}'
                    }
                }
            }
        },
        toggleswitch: {
            colorScheme: {
                light: {
                    root: {
                        background: '{surface.400}',
                        hoverBackground: '{surface.500}'
                    }
                },
                dark: {
                    root: {
                        background: '{surface.600}',
                        hoverBackground: '{surface.500}'
                    }
                }
            }
        }
    }
});
