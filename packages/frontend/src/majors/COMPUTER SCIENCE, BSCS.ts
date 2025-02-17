import { Major } from "@graduate/common";

export const csMajor: Major = {
  name: "Computer Science, BSCS",
  yearVersion: 2018,
  isLanguageRequired: false,
  totalCreditsRequired: 0,
  nupaths: [],
  concentrations: {
    concentrationOptions: [],
    maxOptions: 0,
    minOptions: 0,
  },
  requirementGroups: [
    "Computer Science Overview",
    "Computer Science Fundamental Courses",
    "Computer Science Required Courses",
    "Presentation Requirement",
    "Computer Science Capstone",
    "Computer Science Elective Courses",
    "Mathematics Courses",
    "Computing and Social Issues",
    "Electrical Engineering",
    "Science Requirement",
    "College Writing",
    "Advanced Writing in the Disciplines",
  ],
  requirementGroupMap: {
    "Computer Science Overview": {
      type: "AND",
      name: "Computer Science Overview",
      requirements: [
        {
          type: "COURSE",
          classId: 1200,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 1210,
          subject: "CS",
        },
      ],
    },
    "Computer Science Fundamental Courses": {
      type: "AND",
      name: "Computer Science Fundamental Courses",
      requirements: [
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 1800,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 1802,
              subject: "CS",
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 2500,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 2501,
              subject: "CS",
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 2510,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 2511,
              subject: "CS",
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 2800,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 2801,
              subject: "CS",
            },
          ],
        },
      ],
    },
    "Computer Science Required Courses": {
      type: "AND",
      name: "Computer Science Required Courses",
      requirements: [
        {
          type: "COURSE",
          classId: 3000,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 3500,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 3650,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 3700,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 3800,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 4400,
          subject: "CS",
        },
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 4500,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 4501,
              subject: "CS",
            },
          ],
        },
      ],
    },
    "Presentation Requirement": {
      type: "AND",
      name: "Presentation Requirement",
      requirements: [
        {
          type: "COURSE",
          classId: 1170,
          subject: "THTR",
        },
      ],
    },
    "Computer Science Capstone": {
      type: "OR",
      name: "Computer Science Capstone",
      numCreditsMin: 4,
      numCreditsMax: 5,
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "COURSE",
              classId: 4100,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 4300,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 4410,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 4150,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 4550,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 4991,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 4900,
              subject: "IS",
            },
          ],
        },
      ],
    },
    "Computer Science Elective Courses": {
      type: "RANGE",
      name: "Computer Science Elective Courses",
      numCreditsMin: 8,
      numCreditsMax: 8,
      requirements: {
        type: "RANGE",
        creditsRequired: 8,
        ranges: [
          {
            subject: "CS",
            idRangeStart: 2500,
            idRangeEnd: 5010,
          },
          {
            subject: "IS",
            idRangeStart: 2000,
            idRangeEnd: 4900,
          },
          {
            subject: "DS",
            idRangeStart: 2000,
            idRangeEnd: 4900,
          },
        ],
      },
    },
    "Mathematics Courses": {
      type: "AND",
      name: "Mathematics Courses",
      requirements: [
        {
          type: "COURSE",
          classId: 1341,
          subject: "MATH",
        },
        {
          type: "COURSE",
          classId: 1342,
          subject: "MATH",
        },
        {
          type: "COURSE",
          classId: 2331,
          subject: "MATH",
        },
        {
          type: "COURSE",
          classId: 3081,
          subject: "MATH",
        },
      ],
    },
    "Computing and Social Issues": {
      type: "OR",
      name: "Computing and Social Issues",
      numCreditsMin: 4,
      numCreditsMax: 4,
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "COURSE",
              classId: 3418,
              subject: "ANTH",
            },
            {
              type: "COURSE",
              classId: 5240,
              subject: "IA",
            },
            {
              type: "COURSE",
              classId: 2102,
              subject: "INSH",
            },
            {
              type: "COURSE",
              classId: 1145,
              subject: "PHIL",
            },
            {
              type: "COURSE",
              classId: 1280,
              subject: "SOCL",
            },
            {
              type: "COURSE",
              classId: 3485,
              subject: "SOCL",
            },
            {
              type: "COURSE",
              classId: 4528,
              subject: "SOCL",
            },
          ],
        },
      ],
    },
    "Electrical Engineering": {
      type: "AND",
      name: "Electrical Engineering",
      requirements: [
        {
          type: "COURSE",
          classId: 2160,
          subject: "EECE",
        },
      ],
    },
    "Science Requirement": {
      type: "OR",
      name: "Science Requirement",
      numCreditsMin: 10,
      numCreditsMax: 10,
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1111,
                      subject: "BIOL",
                    },
                    {
                      type: "COURSE",
                      classId: 1112,
                      subject: "BIOL",
                    },
                  ],
                },
                {
                  type: "OR",
                  courses: [
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 1113,
                          subject: "BIOL",
                        },
                        {
                          type: "COURSE",
                          classId: 1114,
                          subject: "BIOL",
                        },
                      ],
                    },
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 2301,
                          subject: "BIOL",
                        },
                        {
                          type: "COURSE",
                          classId: 2302,
                          subject: "BIOL",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1211,
                      subject: "CHEM",
                    },
                    {
                      type: "COURSE",
                      classId: 1212,
                      subject: "CHEM",
                    },
                    {
                      type: "COURSE",
                      classId: 1213,
                      subject: "CHEM",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1214,
                      subject: "CHEM",
                    },
                    {
                      type: "COURSE",
                      classId: 1215,
                      subject: "CHEM",
                    },
                    {
                      type: "COURSE",
                      classId: 1216,
                      subject: "CHEM",
                    },
                  ],
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1200,
                      subject: "ENVR",
                    },
                    {
                      type: "COURSE",
                      classId: 1201,
                      subject: "ENVR",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1202,
                      subject: "ENVR",
                    },
                    {
                      type: "COURSE",
                      classId: 1203,
                      subject: "ENVR",
                    },
                  ],
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1200,
                      subject: "ENVR",
                    },
                    {
                      type: "COURSE",
                      classId: 1201,
                      subject: "ENVR",
                    },
                  ],
                },
                {
                  type: "OR",
                  courses: [
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 2310,
                          subject: "ENVR",
                        },
                        {
                          type: "COURSE",
                          classId: 2311,
                          subject: "ENVR",
                        },
                      ],
                    },
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 2340,
                          subject: "ENVR",
                        },
                        {
                          type: "COURSE",
                          classId: 2341,
                          subject: "ENVR",
                        },
                      ],
                    },
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 3300,
                          subject: "ENVR",
                        },
                        {
                          type: "COURSE",
                          classId: 3301,
                          subject: "ENVR",
                        },
                      ],
                    },
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 4500,
                          subject: "ENVR",
                        },
                        {
                          type: "COURSE",
                          classId: 4501,
                          subject: "ENVR",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1202,
                      subject: "ENVR",
                    },
                    {
                      type: "COURSE",
                      classId: 1203,
                      subject: "ENVR",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 5242,
                      subject: "ENVR",
                    },
                    {
                      type: "COURSE",
                      classId: 5243,
                      subject: "ENVR",
                    },
                  ],
                },
              ],
            },
            {
              type: "OR",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 1145,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1146,
                          subject: "PHYS",
                        },
                      ],
                    },
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 1147,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1148,
                          subject: "PHYS",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 1151,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1152,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1153,
                          subject: "PHYS",
                        },
                      ],
                    },
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 1155,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1156,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1157,
                          subject: "PHYS",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 1161,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1162,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1163,
                          subject: "PHYS",
                        },
                      ],
                    },
                    {
                      type: "AND",
                      courses: [
                        {
                          type: "COURSE",
                          classId: 1165,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1166,
                          subject: "PHYS",
                        },
                        {
                          type: "COURSE",
                          classId: 1167,
                          subject: "PHYS",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    "College Writing": {
      type: "AND",
      name: "College Writing",
      requirements: [
        {
          type: "COURSE",
          classId: 1111,
          subject: "ENGW",
        },
      ],
    },
    "Advanced Writing in the Disciplines": {
      type: "AND",
      name: "Advanced Writing in the Disciplines",
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "COURSE",
              classId: 3302,
              subject: "ENGW",
            },
            {
              type: "COURSE",
              classId: 3315,
              subject: "ENGW",
            },
          ],
        },
      ],
    },
  },
};
