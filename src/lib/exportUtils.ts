import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportTxt = (data: any, regionName: string) => {
  const content = `===============================================
               114年 會考落點分析報告                
===============================================
【基本資料】
身份: ${data.identity === 'student' ? '學生' : data.identity === 'teacher' ? '老師' : '家長'}
分析區域: ${regionName}
選取偏好: ${data.scores.schoolOwnership === 'all' ? '公私立不拘' : data.scores.schoolOwnership === 'public' ? '公立' : '私立'} / ${data.scores.schoolType === 'all' ? '普通與職業類科' : data.scores.schoolType}
產生時間: ${new Date().toLocaleString('zh-TW')}

【您的會考成績】
國文: ${data.scores.chinese}
英文: ${data.scores.english}
數學: ${data.scores.math}
自然: ${data.scores.science}
社會: ${data.scores.social}
作文: ${data.scores.composition} 級分

【積分試算結果】
您的總積分: ${data.results.totalPoints}
您的總積點: ${data.results.totalCredits || '無'}
符合條件推薦學校數: ${data.results.eligibleSchools?.length || 0} 所

===============================================
【推薦名單 (依序位推薦)】
${data.results.eligibleSchools?.map((s: any, i: number) => 
  `${String(i + 1).padStart(2, ' ')}. ${s.name} ${s.group ? `[${s.group}]` : ''} - 預估分數區間: ${s.minScore || s.points || s.score} / 錄取評估: ${
    (s.scoreDiff !== undefined && parseFloat(s.scoreDiff) >= 2) || 
    (s.pointsDiff !== undefined && parseFloat(s.pointsDiff) >= 2) || 
    ((data.results.totalPoints - parseFloat(s.minScore || s.points || s.score || 0)) >= 2) ? '極高 (安全)' :
    (s.scoreDiff !== undefined && parseFloat(s.scoreDiff) >= 0.5) || 
    (s.pointsDiff !== undefined && parseFloat(s.pointsDiff) >= 0.5) || 
    ((data.results.totalPoints - parseFloat(s.minScore || s.points || s.score || 0)) >= 0.5) ? '穩健 (合理)' :
    (s.scoreDiff !== undefined && parseFloat(s.scoreDiff) >= -1) || 
    (s.pointsDiff !== undefined && parseFloat(s.pointsDiff) >= -1) || 
    ((data.results.totalPoints - parseFloat(s.minScore || s.points || s.score || 0)) >= -1) ? '夢幻 (進取)' : '落後'
  }`
).join('\n') || '無推薦名單'}

===============================================
【系統免責聲明】
本系統分析結果僅供參考，不代表實際錄取結果。實際錄取情況可能會因當年度招生政策變化、考生整體表現、特種身分加分、各校招生名額調整等因素而有所不同。請務必以各校最新官方發布之「免試入學招生簡章」為最終依據。
版權宣告TW全國會考落點分析 © ${new Date().getFullYear()} (我們非政府創建)
`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `114年_會考落點分析_${regionName}.txt`);
};

export const exportJson = (data: any) => {
  const enhancedData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      system: 'TW全國會考落點分析引擎',
      version: '1.5.0',
      disclaimer: '本系統分析結果僅供參考，不代表實際錄取結果。'
    },
    userProfile: {
      identity: data.identity,
      region: data.scores.region,
      preferences: {
        ownership: data.scores.schoolOwnership,
        type: data.scores.schoolType
      }
    },
    examScores: {
      chinese: data.scores.chinese,
      english: data.scores.english,
      math: data.scores.math,
      science: data.scores.science,
      social: data.scores.social,
      composition: parseInt(data.scores.composition) || 0
    },
    calculatedResults: {
      totalPoints: data.results.totalPoints,
      totalCredits: data.results.totalCredits || null,
      eligibleSchoolCount: data.results.eligibleSchools?.length || 0,
      recommendedSchools: data.results.eligibleSchools?.map((s: any) => ({
        name: s.name,
        type: s.type,
        ownership: s.ownership,
        group: s.group || null,
        estimatedThreshold: s.minScore || s.points || s.score || null
      })) || []
    }
  };
  const blob = new Blob([JSON.stringify(enhancedData, null, 2)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `114年_會考落點分析_${data.scores.region}.json`);
};

export const exportExcel = (data: any, regionName: string) => {
  const wb = XLSX.utils.book_new();
  
  // 1. Summary Sheet
  const summary = [
    ["114年 會考落點分析結果報告"],
    ["", ""],
    ["【基本資料】"],
    ["產生日期", new Date().toLocaleString('zh-TW')],
    ["分析區域", regionName],
    ["使用者身份", data.identity === 'student' ? '學生' : data.identity === 'teacher' ? '老師' : '家長'],
    ["", ""],
    ["【會考成績】"],
    ["國文", data.scores.chinese],
    ["英文", data.scores.english],
    ["數學", data.scores.math],
    ["自然", data.scores.science],
    ["社會", data.scores.social],
    ["作文級分", data.scores.composition],
    ["", ""],
    ["【運算結果】"],
    ["總積分", data.results.totalPoints],
    ["總積點 (若適用)", data.results.totalCredits || "無"],
    ["", ""],
    ["【免責聲明】"],
    ["本系統結果僅供參考，不代表最終錄取結果。請務必以發布之簡章為準。"]
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, summaryWs, "分析摘要與成績");

  // 2. Schools Sheet
  if (data.results.eligibleSchools?.length) {
    const schoolsData = [
      ["推薦排名", "學校名稱", "群別/科系", "學校類型", "公立/私立", "預估錄取門檻"],
      ...data.results.eligibleSchools.map((s: any, index: number) => [
        index + 1,
        s.name, 
        s.group || "--",
        s.type, 
        s.ownership === '公立' ? '公立' : s.ownership === '私立' ? '私立' : s.ownership,
        s.minScore || s.points || s.score || "--"
      ])
    ];
    const schoolsWs = XLSX.utils.aoa_to_sheet(schoolsData);
    
    // Auto-size columns slightly
    schoolsWs['!cols'] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(wb, schoolsWs, "推薦學校清單");
  } else {
    const emptyWs = XLSX.utils.aoa_to_sheet([["無符合條件之推薦學校"]]);
    XLSX.utils.book_append_sheet(wb, emptyWs, "推薦學校清單");
  }

  XLSX.writeFile(wb, `114年_會考落點分析_${regionName}.xlsx`);
};

export const printResults = () => {
  window.print();
};
