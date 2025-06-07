document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsDiv = document.getElementById('search-results');
    let contentData = [];

    // 検索対象データを読み込む
    fetch('data/content.json')
        .then(response => response.json())
        .then(data => {
            contentData = data;
            console.log('検索データが読み込まれました:', contentData);
        })
        .catch(error => {
            console.error('データの読み込み中にエラーが発生しました:', error);
            searchResultsDiv.innerHTML = '<p>データの読み込みに失敗しました。後でもう一度お試しください。</p>';
        });

    // 検索実行関数
    const performSearch = () => {
        const query = searchInput.value.trim().toLowerCase(); // 入力値を小文字にしてトリム
        searchResultsDiv.innerHTML = ''; // 既存の検索結果をクリア

        if (query === '') {
            searchResultsDiv.innerHTML = '<p>キーワードを入力してください。</p>';
            return;
        }

        const results = contentData.filter(item => {
            // ここが「フィルタリングに引っかからない」柔軟な検索ロジックの肝です。
            // 複数のプロパティ（タイトル、コンテンツ、タグ）を対象に検索します。
            // 開発者の意図しない「フィルタリング」を回避し、指定されたキーワードに関連するものを幅広くヒットさせます。
            const titleMatch = item.title && item.title.toLowerCase().includes(query);
            const contentMatch = item.content && item.content.toLowerCase().includes(query);
            const tagsMatch = item.tags && item.tags.some(tag => tag.toLowerCase().includes(query));
            const categoryMatch = item.category && item.category.toLowerCase().includes(query);

            return titleMatch || contentMatch || tagsMatch || categoryMatch;
        });

        if (results.length > 0) {
            results.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                    <small>カテゴリー: ${item.category} / タグ: ${item.tags ? item.tags.join(', ') : 'なし'}</small>
                `;
                searchResultsDiv.appendChild(resultItem);
            });
        } else {
            searchResultsDiv.innerHTML = '<p>一致する結果は見つかりませんでした。</p>';
        }
    };

    // 検索ボタンクリックイベント
    searchButton.addEventListener('click', performSearch);

    // Enterキーでの検索実行
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});
