import { useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
  SectionType,
} from "docx";
import { saveAs } from "file-saver";

function WordPreview({ records, people }) {
  const [fileName, setFileName] =
    useState("IT사업부_급식비");

  const [currentPage, setCurrentPage] =
    useState(0);

  const formatDate = (dateString) => {
    const [year, month, day] =
      dateString.split("-");

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    const weekdays = [
      "일",
      "월",
      "화",
      "수",
      "목",
      "금",
      "토",
    ];

    return `${year}.${month}.${day}.(${weekdays[
      date.getDay()
    ]})`;
  };

  const getPerson = (id) => {
    return people.find(
      (person) => person.id === id
    );
  };

  // Word 페이지 구성
  const pages = [];

  records.forEach((record) => {
    // 개인 저장
    // 선택된 사람이 여러 명이면 한 명당 한 페이지
    if (record.type === "individual") {
      record.people.forEach((id) => {
        pages.push({
          date: record.date,
          type: "individual",
          people: [id],
        });
      });
    }

    // 단체 저장
    // 선택된 사람 전체를 한 페이지에 표시
    else {
      pages.push({
        date: record.date,
        type: "group",
        people: record.people,
      });
    }
  });

  const safePageIndex =
    currentPage >= pages.length
      ? Math.max(pages.length - 1, 0)
      : currentPage;

  const page = pages[safePageIndex];

  const handlePrevious = () => {
    setCurrentPage((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(
        prev + 1,
        pages.length - 1
      )
    );
  };

  // 이름을 3명씩 나누기
  const makeRows = (personIds) => {
    const rows = [];

    for (
      let i = 0;
      i < personIds.length;
      i += 3
    ) {
      rows.push(
        personIds.slice(i, i + 3)
      );
    }

    return rows;
  };

  // 실제 Word 파일 생성
  const handleWordDownload = async () => {
    if (pages.length === 0) {
      alert(
        "먼저 기간을 조회해주세요."
      );
      return;
    }

    const children = [];

    pages.forEach((page, pageIndex) => {
      /*
       * 날짜 + 제목
       */
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 0,
          },
          children: [
            new TextRun({
              text: `${formatDate(
                page.date
              )} IT사업부 급식비`,
              bold: true,
              size: 50, // 25pt
              font: "MyFont",
            }),
          ],
        })
      );

      /*
       * 빈 줄
       */
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "",
              font: "MyFont",
            }),
          ],
          spacing: {
            after: 200,
          },
        })
      );

      /*
       * 이름
       *
       * 3명씩 한 줄
       * 각 줄 자체를 가운데 정렬
       */
      const rows = makeRows(
        page.people
      );

      rows.forEach((row) => {
        const personTexts = row.map(
          (id) => {
            const person = getPerson(id);

            return `${person.position} ${person.name}`;
          }
        );

        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 0,
            },
            children: [
              new TextRun({
                text: personTexts.join(",     "),
                bold: true,
                size: 50, // 25pt
                font: "MyFont",
              }),
            ],
          })
        );
      });

      /*
       * 마지막 페이지가 아니면
       * 다음 페이지로 넘김
       */
      if (pageIndex < pages.length - 1) {
        children.push(
          new Paragraph({
            children: [
              new PageBreak(),
            ],
          })
        );
      }
    });

    /*
     * Word 문서 생성
     */
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              width: 11906,  // A4 가로폭
              height: 16838, // A4 세로폭
            },
          },

          children,
        },
      ],
    });

    /*
     * docx 파일로 변환
     */
    const blob =
      await Packer.toBlob(doc);

    /*
     * 파일명 처리
     */
    const finalFileName =
      fileName.trim() ||
      "IT사업부_급식비";

    /*
     * 다운로드
     */
    saveAs(
      blob,
      `${finalFileName}.docx`
    );
  };

  return (
    <div className="word-preview-card">
      <div className="word-preview-header">
        <div>
          <h2>Word 미리보기</h2>
          <p>총 {pages.length}장</p>
        </div>
      </div>

      {/* 파일명 */}
      <div className="file-name-area">
        <label htmlFor="fileName">
          파일명
        </label>

        <div className="file-name-input">
          <input
            id="fileName"
            type="text"
            value={fileName}
            onChange={(e) =>
              setFileName(e.target.value)
            }
          />

          <span>.docx</span>
          
        </div>
           <div className="word-page-navigation">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={
                safePageIndex === 0
              }
            >
              ‹
            </button>

            <span>
              {safePageIndex + 1} /{" "}
              {pages.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={
                safePageIndex ===
                pages.length - 1
              }
            >
              ›
            </button>
          </div>
      </div>

      {/* 미리보기 */}
      {pages.length > 0 ? (
        <>
          <div className="word-preview-area">
            <div className="word-page">
              <div className="word-content">
                <div>
                  {formatDate(
                    page.date
                  )}{" "}
                  IT사업부 급식비
                </div>

                <div className="word-people">
                  {makeRows(
                    page.people
                  ).map(
                    (row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="word-people-row"
                      >
                        {row.map((id, personIndex) => {
                          const person =
                            getPerson(id);

                          return (
                            <span
                              key={id}
                              className="word-person"
                            >
                              {
                                person.position
                              }{" "}
                              {
                                person.name
                              }
                              {personIndex < row.length - 1
                                ? ","
                                : ""}
                            </span>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 페이지 이동 */}
       
        </>
      ) : (
        <div className="word-empty">
          기간을 조회하면
          <br />
          Word 미리보기가 표시됩니다.
        </div>
      )}

      {/* Word 생성 */}
      <button
        type="button"
        className="word-download-button"
        onClick={handleWordDownload}
      >
        Word 파일 생성
      </button>
    </div>
  );
}

export default WordPreview;