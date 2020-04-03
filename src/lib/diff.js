export function LCS(oldObj, newObj) {
    var arr1 = []
    var arr2 = []
    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
        arr1 = oldObj
        arr2 = newObj
    } else if (typeof (oldObj) === 'string' && typeof (newObj) === 'string') {
        arr1 = oldObj.trim(); arr2 = newObj.trim()
    } else {
        alert('两个参数要一致,都为数组或字符串！')
        return
    }

    var arr = []
    var sameArr = []
    var oldObjLength = arr1.length
    var newObjLength = arr2.length
    var sameIndex = {}
    if (oldObjLength === 0 || newObjLength === 0) {
        return { 'maxMatchLength': 0, 'match1': [], 'match2': [] }
    }

    var i = 0
    var a = 0
    for (i = 0; i < oldObjLength + 1; i++) {
        arr[i] = [0]
        sameArr[i] = [0]
        for (a = 0; a < newObjLength + 1; a++) {
            arr[i][a] = 0
            sameArr[i][a] = 0
            if (i !== 0 && a !== 0) {
                if (arr1[i - 1] === arr2[a - 1]) {
                    arr[i][a] = arr[i - 1][a - 1] + 1
                    if (sameIndex[i - 1]) {
                        sameIndex[i - 1].push([i - 1, a - 1])
                    } else {
                        sameIndex[i - 1] = [[i - 1, a - 1]]
                    }

                    sameArr[i][a] = 0 // 输出公共子串时的搜索方向
                } else if (arr[i - 1][a] > arr[i][a - 1]) {
                    arr[i][a] = arr[i - 1][a]
                    sameArr[i][a] = 1
                } else {
                    arr[i][a] = arr[i][a - 1]
                    sameArr[i][a] = -1
                }
            }
        }
    }

    var flag = true
    var sameStr = ''
    var oldObjIndex = []
    var newObjIndex = []
    while (flag) {
        if (sameArr[oldObjLength][newObjLength] === 0) {
            oldObjLength--
            newObjLength--
            sameStr += oldObj[oldObjLength]
            oldObjIndex.push(oldObjLength)
            newObjIndex.push(newObjLength)
        } else if (sameArr[oldObjLength][newObjLength] === 1) {
            oldObjLength--
        } else {
            newObjLength--
        }
        if (oldObjLength === 0 || newObjLength === 0) {
            flag = false
        }
    }
    sameStr = sameStr.split('').reverse().join('')
    oldObjIndex = oldObjIndex.reverse()
    newObjIndex = newObjIndex.reverse()

    return {
        'maxMatchLength': sameStr.length,
        'match1': oldObjIndex,
        'match2': newObjIndex
    }
}

function diffString(differenceJson, oldObj, newObj, line) {
    oldObj = oldObj || ''
    newObj = newObj || ''
    line = line || 0
    var lcsObj = LCS(oldObj, newObj)
    if (!lcsObj) {
        return
    }
    var maxMatchLength = lcsObj.maxMatchLength
    var match1 = lcsObj.match1
    var match2 = lcsObj.match2
    if (!Object.keys(differenceJson.remove).length && !Object.keys(differenceJson.add).length) {
        var newRow = !maxMatchLength || false
        differenceJson.remove[0] = { 'cols': {}, 'newRow': newRow }
        differenceJson.add[0] = { 'cols': {}, 'newRow': newRow }
    }
    var i = 0
    for (i = 0; i < oldObj.length; i++) {
        if (match1.indexOf(i) < 0) {
            differenceJson.remove[line].cols[i] = oldObj[i]
        }
    }
    for (i = 0; i < newObj.length; i++) {
        if (match2.indexOf(i) < 0) {
            differenceJson.add[line].cols[i] = newObj[i]
        }
    }

    if (!Object.keys(differenceJson.remove[line].cols).length) {
        delete differenceJson.remove[line]
    }
    if (!Object.keys(differenceJson.add[line].cols).length) {
        delete differenceJson.add[line]
    }

    return differenceJson
}

export function diffJson(oldObj, newObj) {
    var differenceJson = { 'remove': {}, 'add': {} }
    if (typeof oldObj === 'string') {
        oldObj = oldObj.split('\n')
    }
    if (typeof newObj === 'string') {
        newObj = newObj.split('\n')
    }
    var lcsObj = LCS(oldObj, newObj)
    if (!lcsObj) {
        return
    }
    // var maxMatchLength = lcsObj.maxMatchLength
    var match1 = lcsObj.match1
    var match2 = lcsObj.match2
    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
        var i = 0
        if (oldObj.length > newObj.length) {
            for (i = 0; i < oldObj.length; i++) {
                if (match1.indexOf(i) < 0 && match2.indexOf(i) < 0) {
                    differenceJson.remove[i] = { 'cols': {}, 'newRow': false }
                    differenceJson.add[i] = { 'cols': {}, 'newRow': false }
                    differenceJson = diffString(differenceJson, oldObj[i], newObj[i], i)
                } else if (match1.indexOf(i) < 0 && match2.indexOf(i) >= 0) {
                    differenceJson.remove[i] = { 'cols': { 0: oldObj[i] }, 'newRow': true }
                } else if (match1.indexOf(i) >= 0 && match2.indexOf(i) < 0) {
                    differenceJson.add[i] = { 'cols': { 0: newObj[i] }, 'newRow': true }
                }
            }
        } else {
            for (i = 0; i < newObj.length; i++) {
                if (match2.indexOf(i) < 0 && match1.indexOf(i) < 0) {
                    differenceJson.remove[i] = { 'cols': {}, 'newRow': false }
                    differenceJson.add[i] = { 'cols': {}, 'newRow': false }
                    differenceJson = diffString(differenceJson, oldObj[i], newObj[i], i)
                } else if (match2.indexOf(i) < 0 && match1.indexOf(i) >= 0) {
                    differenceJson.add[i] = { 'cols': { 0: newObj[i] }, 'newRow': true }
                } else if (match2.indexOf(i) >= 0 && match1.indexOf(i) < 0) {
                    differenceJson.remove[i] = { 'cols': { 0: oldObj[i] }, 'newRow': true }
                }
            }
        }
    } else if (typeof (oldObj) === 'string' && typeof (newObj) === 'string') {
        differenceJson = diffString(differenceJson, oldObj, newObj)
    }

    return differenceJson
}

export function diffAddSpan(obj, arr) {
    if (typeof arr === 'string') {
        arr = arr.split('\n')
    }
    var rowInfo = {}
    var cols = {}
    var arrLine = []
    var i = 0
    var j = 0
    for (i in obj) {
        rowInfo = obj[i]
        if (rowInfo.newRow) {
            arr[i] = '<span>' + arr[i] + '</span>'
        } else {
            cols = rowInfo.cols
            arrLine = arr[i].split('')
            for (j in cols) {
                arrLine[j] = '<span>' + arrLine[j] + '</span>'
            }
            arr[i] = arrLine.join('')
        }
    }
    return arr
}

/**
 * 根据历史差异列表 还原对应历史
 * @param newStr 最新内容
 * @param historyArr 差异历史数组
 * @param index 还原到第几个历史
 */
export function markdownRestore(newStr, historyArr, index) {
    var oldStr = newStr.split('\n')
    var remove = {}
    var add = {}
    var row = {}
    var newStrRow = []
    var i = 0
    var j = 0
    var z = 0
    for (i = 0; i <= index; i++) {
        remove = historyArr[i].remove
        add = historyArr[i].add
        for (j in add) {
            row = add[j]
            if (row.newRow) {
                oldStr[j] = '--delete this--'
            } else {
                newStrRow = oldStr[j].split('')
                for (z in row.cols) {
                    newStrRow[z] = '--delete this--'
                }
                oldStr[j] = newStrRow.join('')
            }
        }
        oldStr = oldStr.join('\n').replace(/--delete this--![\n\r]/g, '').split('\n')
        for (j = oldStr.length; j >= 0; j--) {
            if (oldStr[j] === '--delete this--') {
                oldStr.splice(j, 1)
            }
        }
        oldStr = oldStr.join('\n').replace(/--delete this--/g, '').split('\n')
        for (j in remove) {
            row = remove[j]
            if (row.newRow) {
                oldStr.splice(j, 0, row.cols[0])
            } else {
                newStrRow = oldStr[j].split('')
                for (z in row.cols) {
                    if (newStrRow.length - 1 < z) {
                        newStrRow.push(row.cols[z])
                    } else {
                        newStrRow.splice(j, 0, row.cols[z])
                    }
                }
                oldStr[j] = newStrRow.join('')
            }
        }
    }
    return oldStr
}

function canvasDataCreat(obj) {
    var removeObj = obj.remove
    var addObj = obj.add
    var cvObj = []
    var lPLen = document.getElementById('old_info').childElementCount - 1
    var rPLen = document.getElementById('new_info').childElementCount - 1
    for (var i in removeObj) {
        i = Number(i)
        var row = removeObj[i]
        var rMax = i > rPLen ? rPLen : i
        var rMax1 = i + 1 > rPLen ? rPLen : i + 1
        if (row.newRow) {
            cvObj.push({
                lStartLine: i,
                lEndLine: 1 + i,
                rStartLine: rMax,
                rEndLine: rMax
            })
        } else {
            cvObj.push({
                lStartLine: i,
                lEndLine: 1 + i,
                rStartLine: rMax,
                rEndLine: rMax1
            })

            if (addObj[i]) {
                delete addObj[i]
            }
        }
    }
    for (i in addObj) {
        i = Number(i)
        row = addObj[i]
        var lMax = i > lPLen ? lPLen : i
        var lMax1 = i + 1 > lPLen ? lPLen : i + 1
        if (row.newRow) {
            cvObj.push({
                lStartLine: lMax,
                lEndLine: lMax,
                rStartLine: i,
                rEndLine: 1 + i
            })
        } else {
            cvObj.push({
                lStartLine: lMax,
                lEndLine: lMax1,
                rStartLine: i,
                rEndLine: 1 + i
            })
        }
    }

    return cvObj
}

export function diffCanvas(diffObj) {
    var cvObj = canvasDataCreat(diffObj)
    var canvas = document.getElementById('canvas')
    var context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    canvas.height = document.getElementById('canvas_box').offsetHeight

    var radius = 3
    var cvWidth = canvas.width
    var lScrollTop = document.getElementById('old_info').scrollTop
    var rScrollTop = document.getElementById('new_info').scrollTop
    cvObj.forEach(function (value, index) {
        var rdis = 6
        var ldis = 6
        var lStartLine = value.lStartLine + 1
        var lEndLine = value.lEndLine + 1
        var rStartLine = value.rStartLine + 1
        var rEndLine = value.rEndLine + 1
        var lstart = document.querySelector('#old_info > p:nth-child(' + lStartLine + ')').offsetTop - lScrollTop
        var lend = document.querySelector('#old_info > p:nth-child(' + lEndLine + ')').offsetTop - lScrollTop
        var rstart = document.querySelector('#new_info > p:nth-child(' + rStartLine + ')').offsetTop - rScrollTop
        var rend = document.querySelector('#new_info > p:nth-child(' + rEndLine + ')').offsetTop - rScrollTop

        context.beginPath()
        context.strokeStyle = '#cdcdcd'
        context.lineWidth = 1

        context.moveTo(0, lstart)
        if (lstart !== lend) {
            context.arcTo(6, lstart, 6, lstart + radius, radius)
            context.arcTo(6, lend, 3, lend, radius)
            context.lineTo(0, lend)
        }
        context.stroke()

        context.moveTo(cvWidth, rstart)
        if (rstart !== rend) {
            context.arcTo(cvWidth - 6, rstart, cvWidth - 6, rstart + radius, radius)
            context.arcTo(cvWidth - 6, rend, cvWidth - 3, rend, radius)
            context.lineTo(cvWidth, rend)
        }
        context.stroke()

        var dl = (lend - lstart) / 2 + lstart
        var dr = (rend - rstart) / 2 + rstart

        if (rstart === rend) {
            rdis = 0
        }
        if (lstart === lend) {
            ldis = 0
            context.moveTo(0, dl)
        } else {
            context.moveTo(6, dl)
        }
        if (dl === dr) {
            context.lineTo(cvWidth - 6, dr)
        } else {
            context.bezierCurveTo(ldis + 12, dl - 3, cvWidth - rdis - 12, dr - 3, cvWidth - rdis, dr)
        }
        context.stroke()
    })
}

export function diffScroll(diffObj) {
    diffCanvas(diffObj)
    document.getElementById('old_info').onscroll = function (e) {
        diffCanvas(diffObj)
    }
    document.getElementById('new_info').onscroll = function (e) {
        diffCanvas(diffObj)
    }

    var reductionScroll = 0
    document.getElementById('canvas_box').onmousewheel = function (e) {
        e.preventDefault()
        var wheel = e.wheelDelta || -e.detail
        if (wheel > 0) {
            wheel = 100
        } else {
            wheel = -100
        }
        reductionScroll += wheel
        document.getElementById('old_info').scrollTop = -reductionScroll
        document.getElementById('new_info').scrollTop = -reductionScroll
    }
}
